# [![JMCNet Logo](https://code.google.com/p/jmcnet/logo)](https://github.com/jmcollin78/jmcnet/) JMCNet library !

JMCNet provides a JavaScript implementation of the JMCNet Java library (cf. [JMCNet Java Library](https://code.google.com/p/jmcnet/) for more information).
It provides utility libraries for :

* <i>jmcnet-date</i> - <b>date manipulation</b> : adding days, weeks and month to date,
* <i>jmcnet-config</i> - <b>properties file management</b> : automatic reload of .properties file on change, resources bundle for i18n features,
* <i>jmcnet-email</i> - <b>email management</b> : add attachment, deals with image attachment, automatically create attachment from html text,
* <i>jmcnet-emailTemplate</i> - <b>templated email features</b> : cooperate with email features above to send beautiful html templated emails,
* <i>jmcnet-exception</i> - <b>exception feature</b> : the base exception used with all modules above,
* <i>jmcnet-resourceBundle</i> - <b>Localized resource bundle</b> : dealing with localized resources bundle for i18n.


## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm

### Tools Prerequisites
* NPM - Node.js package manage; should be installed when you install node.js.

### Optional [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
* Grunt - Download and Install [Grunt](http://gruntjs.com).
```
$ npm install -g grunt-cli
```

## Additional Packages
* none yet.

## Dependencies
All JMCNet libs have [Lodash](http://lodash.com/) and [Log4js-node](https://github.com/nomiddlename/log4js-node) dependencies.

* <b>jmcnet-email</b> has [Node-mailer](http://www.nodemailer.com/) dependencies,
* <b>jmcnet-emailTemplate</b> has [Ejs](http://embeddedjs.com/) dependencies,
* <b>jmcnet-config</b> has [java-properties](https://github.com/mattdsteele/java-properties) dependencies,
* <b>jmcnet-resourceBundle</b> has [java-properties](https://github.com/mattdsteele/java-properties) dependencies

## Quick Install
The quickest way to get started with JMCNet Library is to fork the Github repo.
```
$ [sudo] git fork git@github/jmcollin78/jmcnet.git
$ cd jmcnet
$ npm install
```

We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the test :
```
$ grunt testu
```

If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:
```
$ grunt -f testu
```

Alternatively, when not using `grunt` you can run:
```
$ node test
```

## Troubleshooting
During install some of you may encounter some issues.

Most issues can be solved by one of the following tips, but if are unable to find a solution feel free to contact us via the repository issue tracker or the links provided below.

#### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*. Usually updating those tools to the latest version solves the issue.

* Updating NPM:
```
$ npm update -g npm
```

* Updating Grunt:
```
$ npm update -g grunt-cli
```

#### Cleaning NPM
NPM has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

* NPM Clean Cache:
```
$ npm cache clean
```

## Getting Started with JMCNet library
Include JMCNet lib in the require sections :

```
var jmcnet = require('jmcnet');
```
JMCNet Library contains those modules :

### Exception (jmcnet-exception)
A base module containing BaseException, FunctionalException and TechnicalException
```
throw new jmcnet.exception.TechnicalException('The error message', [arg1, arg2]);
...
throw new jmcnet.exception.FunctionalException('The functional error message', [arg1, arg2]);
```

### Date manipulation (jmcnet-date)
A module containing date helpers functions like :

 * <b><i>jmcnet.date.getDateHourMinuteNow()</i></b> : gives the current date limited to minutes informations (skip seconds and millisec),
 * <b><i>jmcnet.date.getDateNow()</i></b> : gives the current date limited to date informations (skip hours, muinutes, seconds and millisec),
 * <b><i>jmcnet.date.addDays(date, nbDays)</i></b> : gives back a date which is date in argument with days augmented by nbDays,
 * <b><i>jmcnet.date.addWeeks(date, nbWeeks)</i></b> : gives back a date which is date in argument with weeks augmented by nbWeeks,
 * <b><i>jmcnet.date.addMonth(date, nbMonths)</i></b> : gives back a date which is date in argument with month augmented by nbMonths,
 * <b><i>jmcnet.date.addMonth(date, nbYears)</i></b> : gives back a date which is date in argument with year augmented by nbYears,

### .properties files manipulations (jmcnet-config)
A module for dealing with configuration files in the .properties style (like in Java) with <b>automatic reload of the properties on file changes</b>.

 * <b><i>jmcnet.config.loadConfig(path, options)</i></b> : loads a set of configuration files. Path is the base directory of all configuration files. Options are the following :
 ```
    // the base file containing a reference to all subfile
    masterFileName: 'master-config.properties',
    // when the master file or a subfile is changed, reloads all
    reloadOnChange: true,
    // period in second between two checks
    checkReloadTimeSec: 10                      
```
 
 * <b><i>jmcnet.config.get(key)</i></b> : get the value of a key
 * <b><i>jmcnet.config.getKeys()</i></b> : get all the properties keys
 * <b><i>jmcnet.config.addListener(callback)</i></b> : adds a listener to the configuration reloads. The callbacks are called upon a config reload 

### Resource bundle for i18n .properties files (jmcnet-resourceBundle)
A module for dealing with resource bundle files in the .properties style. A resource bundle is a set of files having the same base name, a .properties file extension. Each file contains key/value set with different translations for a same key.

 Examples of resource bundle files:

 <i>test1_en.properties:</i>
 ```
 w1=Hello this is an English sentence
 w2=${w1} and I will terminate it.
 ```

 <i>test1_fr.properties:</i>
 ```
 w1=Bonjour ceci est une phrase en Français
 w2=${w1} et je la termine.
 templatedString=The templated String with val1=<%= val1 %> and val2=<%= val2 %>.
 ```

 <i>test1_fr_FR.properties:</i>
 ```
 w1=Bonjour ceci est une phrase en Français de France
 w2=${w1} et je la termine.
 ```

* <b><i>jmcnet.resourceBundle.ResourceBundle(path, baseName, options)</i></b> : creates a resource bundle (ie. the set of files for each translation). Path is the base directory of all .properties files. BaseName is the base name used for all files. See options below.
```
var rsc = new jmcnet.resourceBundle.ResourceBundle('./path/to/resources/', 'test1');        
```

* <b><i>jmcnet.resourceBundle.getLocaleFile(bundleBaseName, locale)</i></b> : gets the previously loaded properties file for bundle with base name 'bundleBaseName' and for locale 'locale'. If no file is provided for locale 'locale' the most approching locale is returned. That is file returned for base name 'test1' and locale 'en_En' could be (in order) 'test1_en_En.properties' or test1_en.properties' if the first one is not found,
* <b><i>jmcnet.resourceBundle.getLocaleString(file, key, context)</i></b> : get a string from a locale file 'file'. The string is assumed to be a template string (in the form of ejs). Values from template string are replaced with 'context'. See example below,
* <b><i>jmcnetResourceBundle.getBundle(bundleBaseName) : retrieve the bundle named bundleBaseName</i></b>
* <b><i>ResourceBundle.load([callback])</i></b> : load all resource bundle files. If callback is provided, load is done asynchronously and callback is a function that takes an error in argument.
* <b><i>ResourceBundle.getFiles()</i></b> : get all the properties files loaded. jmcnet.resourceBundle.getFiles().fr gives the property file for locale 'fr',
* <b><i>ResourceBundle.setOptions(options)</i></b> : set the reload options of the resource bundle. Available options are :
 ```
    // when one of the locale file is changed, reloads it
    reloadOnChange: true,
    // period in second between two checks
    checkReloadTimeSec: 10                      
 ```

 <b>Code example using the tests files above :</b>
 ```
 new jmcnetResourceBundle.ResourceBundle('./test/resources/', 'test1', {
    reloadOnChange: false // don't check for file change
 }); 
 // creates a new ResourceBundle will check for file change every minutes
 new jmcnetResourceBundle.ResourceBundle('./test/resources/', 'test2');
 ...
 // gets the French for France properties file with base name test1
 var w2 = jmcnetResourceBundle.getLocaleFile('test1', 'fr_FR').get('w2');
 expect(w2).to.equal('Bonjour ceci est une phrase en Français de France et je la termine.');
 ...
 var w2 = jmcnetResourceBundle.getLocaleFile('test1', 'en_US').get('w2');
 expect(w2).to.equal(Hello this is an English sentence and I will terminate it.');
 ...
 var rsc = new jmcnetResourceBundle.ResourceBundle('./test/resources/', 'test2');
 var localeFile = rsc.getLocaleFile('en_EN');
 war w2 = localeFile.get('a.key', 'a default value');
 ...
 rsc.setOptions({
     reloadOnChange: true,
     checkReloadTimeSec: 60 // check every minute if file has change and reloads the file
 });
 ...
 
 // Templating
 var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'fr');
 var replacedValue = jmcnetResourceBundle.getLocalString(
     localFile,
     'templatedString',
     { val1 : 'val1', val2 : 12});
 expect(replacedValue).to.equal('The templated String with val1=val1 and val2=12.');
            
 ```
  

### Email features (jmcnet-email)
A module to manage email and image attachments. You can use like this :

* <b><i>Create email</i></b>
```
var Email = jmcnet.email.Email;
var email = new Email('from@test.com', 'to@test.com', 'My subject string', 'My text string', '<html>My html string</html>');
```
* <b><i>Create a fake transport (useful for testing)</i></b>
```
var fkTp = jmcnet.email.setFakeTransport();
email.sendEmail(function () {
    expect(fkTp.sentEmails).to.have.length(1);
    var sentEmail = fkTp.sentEmails[0];
    // reseting the sent mails
    fkTp.resetSentEmails();
    expect(fkTp.sentEmails).to.have.length(0);
    done();
});
```
* <b><i>or create a real smtp transport</i></b>
```
var smtpServer = 'smtp.xxx.xxx';
var port = 465;
var login = 'xxxx';
var pwd = 'xxxx';
var from = 'xxxx';
var to = 'xxxx';
jmcnet.email.setSmtpTransport(smtpServer, port, login, pwd, 60000); // 60 sec timeout
var email = new Email(from, to, 'Test email fron JmcNetEmail lib', 'My text string', '<html>My html string</html>');
email.sendEmail(function (err, info) {
    log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
    if (err) { // manage error
    }
    ...
});
```
* <b><i>Adding attachment</i></b>
 ```
 email.addAttachment('image.png', 'http://url/to/images.png');
 ```
* <b><i>Replace all image in html with an attachment and corresponding cid:</i></b>
 ```
 email = new Email('from@test.com', 'to@test.com',
        'My subject string',
        'My text string',
        '<html>An image: <img src="./images/test.png"></img></html>');
 email.createImageAttachmentFromHtml('/path/to/images/');
 // This last command parse the html, replace all <img src=> with the corresponding cid: instruction
 ```

### Email templating features (jmcnet-emailTemplate)
This module provides very easy features to send beautiful html email based on template.

* <b><i>Creates a template from Strings</i></b>
 ```
 var EmailTemplate = jmcnet.emailTemplate.EmailTemplate;
 var template = new EmailTemplate(
        'templateName',
        'The subject of the mail with <%= user.lastname %>',
        '<html>The email templated body <%= user.firstname %></html>');

 ```
* <b><i>Loads a template from a file</i></b>
 ```
 var template = jmcnet.emailTemplate.loadEmailTemplateFromFile(
        'templateName',
        'subject <%= title %>',
        '/path/to/template/file.html');
 ```
* <b><i>Retrieve a previously loaded template</i></b>
 ```
 jmcnet.emailTemplate.getLstTemplates(); // list all templates
 var template = jmcnet.emailTemplate.getEmailTemplate('templateName');
 ```
* <b><i>Reset all loaded templates</i></b>
 ```
 jmcnet.emailTemplate.resetEmailTemplates();
 ```
* <b><i>Sends a templated email</i></b>
 ```
 email = new Email(from, to);
 jmcnet.email.setSmtpTransport(smtpServer, port, login, pwd, 60000);
 template = jmcnet.emailTemplate.loadEmailTemplateFromFile('realTemplate ', '[\u2601 Testu] Création d\'un compte', 'test/emailTemplates/realTemplate.html');
 var context={
            mail_commons_header : 'Vous recevez cet e-mail ...',
            headerH1 : 'Création d\'un compte',
            account : {
                email : 'test@testu.com',
                pseudo : 'The test man'
            },
            password : 'hyXPyDKx',
            urlAccountApp : 'http://clouderial.com/account-web'
 };
 var lang='fr';
 jmcnetEmail.setBaseImgDir('./test/emailTemplates/images');
 // Does a 2 pass rendering
 template.sendEmail2Pass(email, context, lang, function (err, info) {
            expect(err).to.not.exist;
 });
 ```
or
 ```
 // Does a single pass rendering
 template.sendEmail(email, context, lang, function (err, info) {
            expect(err).to.not.exist;
 });
```

## Release notes
* 1.2.9 : add jmcnetResourceBundle.getLocaleString to get a template String replaced with context
* 1.2.8 : fix some log verbosity

## More Information
* Visit us at [Clouderial.com](http://clouderial.com/).
* Visit our blog informations at [Clouderial.com](http://clouderial.com/blog).
* Visit our support forum informations at [Clouderial.com](http://clouderial.com/forum).
* See the library in action with our :
 * [online project management application](http://en.clouderial.com/online-project-management/)
 * [online todo list application](http://en.clouderial.com/online-task-management/)
 * [online invoice and quotation application](http://en.clouderial.com/quote-invoice-online/)
 * [gestion de projet en ligne](http://clouderial.com/la-gestion-de-projet-en-ligne/)
 * [todo liste et gestion de tâche en ligne](http://clouderial.com/gestion-tache-en-ligne/)
 * [devis et facture en ligne](http://clouderial.com/faire-un-devis-ou-une-facture-en-ligne/)
 

## License
This module is distributed under the MIT License.
