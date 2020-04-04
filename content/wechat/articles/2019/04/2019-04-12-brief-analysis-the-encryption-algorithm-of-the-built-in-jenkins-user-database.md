---
title: "简析 Jenkins 专有用户数据库加密算法"
description: "本文对 Jenkins 专有用户数据库加密算法进行简要分析"
date: 2019-04-12
tags:
- jenkins
author: donhui
---

### 认识Jenkins专有用户数据库
Jenkins 访问控制分为：安全域（即认证）与授权策略。

其中，安全域可以采用三种形式，分别为：Jenkins 专有用户数据库、LDAP、Servlet 容器代理。
![jenkins-security-realm.png](jenkins-security-realm.png)

### 在哪里看到加密后的用户密码信息？
Jenkins 专有用户的数据信息存放位置：$JENKINS_HOME/users/

每个用户的相关信息存放在各自的 config.xml 文件中： $JENKINS_HOME/users/$user/config.xml

在 config.xml 文件中的 passwordHash 节点可以看到用户密码加密后的密文哈希值：
![jenkins-user-config.png](jenkins-user-config.png)

### 用户密码是用什么算法加密的呢？
那么问题来了，用户密码是用何种加密方式加密的呢？可否通过解密密文得到明文呢？

在 [GitHub](https://github.com/jenkinsci/jenkins) 上查看其源码，通过关键字 #jbcrypt 搜索定位到 HudsonPrivateSecurityRealm.java 这个文件。
HudsonPrivateSecurityRealm.java 具体路径是：jenkins/core/src/main/java/hudson/security/HudsonPrivateSecurityRealm.java

源码片段如下：
```java
    /**
     * {@link PasswordEncoder} that uses jBCrypt.
     */
    private static final PasswordEncoder JBCRYPT_ENCODER = new PasswordEncoder() {
        public String encodePassword(String rawPass, Object _) throws DataAccessException {
            return BCrypt.hashpw(rawPass,BCrypt.gensalt());
        }

        public boolean isPasswordValid(String encPass, String rawPass, Object _) throws DataAccessException {
            return BCrypt.checkpw(rawPass,encPass);
        }
    };
    /**
     * Combines {@link #JBCRYPT_ENCODER} and {@link #CLASSIC} into one so that we can continue
     * to accept {@link #CLASSIC} format but new encoding will always done via {@link #JBCRYPT_ENCODER}.
     */
    public static final PasswordEncoder PASSWORD_ENCODER = new PasswordEncoder() {
        /*
            CLASSIC encoder outputs "salt:hash" where salt is [a-z]+, so we use unique prefix '#jbcyrpt"
            to designate JBCRYPT-format hash.
            '#' is neither in base64 nor hex, which makes it a good choice.
         */
        public String encodePassword(String rawPass, Object salt) throws DataAccessException {
            return JBCRYPT_HEADER+JBCRYPT_ENCODER.encodePassword(rawPass,salt);
        }

        public boolean isPasswordValid(String encPass, String rawPass, Object salt) throws DataAccessException {
            if (encPass.startsWith(JBCRYPT_HEADER))
                return JBCRYPT_ENCODER.isPasswordValid(encPass.substring(JBCRYPT_HEADER.length()),rawPass,salt);
            else
                return CLASSIC.isPasswordValid(encPass,rawPass,salt);
        }

        private static final String JBCRYPT_HEADER = "#jbcrypt:";
    };
```


通过分析该源码得知：
1. 明文通过 jbcrypt 算法得到密文 encPass
2. 密文的格式为：salt: encPass，其中以 #jbcrypt 表示 salt 作为数据头

### jbcrypt 是什么？
[jbcrypt](http://www.mindrot.org/projects/jBCrypt/) 是 bcrypt 加密工具的 java 实现。
它的 API 非常简单，DEMO 如下，在 HudsonPrivateSecurityRealm.java 中可以看到加密和校验时使用了如下 API：
```java
// Hash a password for the first time 
String hashed = BCrypt.hashpw(password, BCrypt.gensalt()); 

// gensalt's log_rounds parameter determines the complexity the work factor is 2**log_rounds, and the default is 10 
String hashed = BCrypt.hashpw(password, BCrypt.gensalt(12)); 

// Check that an unencrypted password matches one that has previously been hashed 
if (BCrypt.checkpw(candidate, hashed)) 
  System.out.println("It matches"); 
else 
  System.out.println("It does not match");
```

经验证，用 jbcrypt 对同一个明文加密后因为 salt 一般不同，加密后的密文一般不同。

### bcrypt 精要概况
1. bcrypt 是不可逆的加密算法，无法通过解密密文得到明文。
2. bcrypt 和其他对称或非对称加密方式不同的是，不是直接解密得到明文，也不是二次加密比较密文，而是把明文和存储的密文一块运算得到另一个密文，如果这两个密文相同则验证成功。

### 总结
综上， Jenkins 专有用户数据库使用了 jbcrypt 加密， jbcrypt 加密是不可逆的，而且对于同一个明文的加密结果一般不同。
