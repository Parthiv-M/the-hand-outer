# The Hand-Outer

A _hand-outer_ application that does what it claims—hand out newsletters in this case. This hand-outer doles out a copy of the newsletter to every subscriber's email address (which is fetched from the database via an API) every week, powered by [nodemailer](https://www.npmjs.com/package/nodemailer). If you want a peek, take a look [here](https://the-hand-outer.herokuapp.com/).

## The Trials

Initially, I had built this to be scheduled by [node-cron](https://www.npmjs.com/package/node-cron). Then came the deployment part and I was forced to reconsider my options. Here is what followed.

1. Vercel is mainly intended for deploying serverless functions. Even though I deployed my express app on vercel with a `vercel.json` configuration file, the scheduled task will not be performed as Vercel does not have a running server. So, that possibility was ruled out, even though there was an option of hitting the serverless function with a [GitHub actions](https://docs.github.com/en/actions/learn-github-actions) cron job.

2. The second thing that went against Vercel was the fact that it blocked SMTP connections, even thuogh the documentation [says otherwise](https://vercel.com/support/articles/serverless-functions-and-smtp), and did not allow nodemailer to send emails. I did not want to use any third party services (like SendGrid) yet.

3. I then thought I could run the express app with node-cron on Heroku, but Heroku has a problem with the app _dozing_ off once it stops receiving hits. Hence, that got ruled out too.

In the end, I created a `POST` route with an authentication header which then goes on to send out the emails. It can be called with a simple `CURL` request like `curl --request POST --url 'https://the-hand-outer.herokuapp.com/' --header 'auth_key: AUTH_KEY'`.

## A general use-case

This project can be used in a general scenario as well. Instead of being limited to just sending e-mails, it can be configured to repeat menial tasks with just a POST request. Replacing parts of the code with your own to-be-repeated operation will do the trick. In this specific case, I have leveraged [express](https://expressjs.com/) to make use of a few of its functionalities.

## Points to note for HTML in email

I stumbled quite a bit while setting this up for myself, and want to note down a few points for general consideration. 

- While setting up scheduled e-mailers for a variety of content, it is best to use some form of server side templating engine (I have used [handlebars](https://handlebarsjs.com/)) if you want dynamic code injection, since executing a script before sending across the html might prove to be quite a task.
- `<table>` elements are the safest when it comes to setting up HTML for emails. The following block of code should get you started.
  ```
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <td align="center" border="0" bgcolor="white">
      <! –– optionally, headings can be placed here -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <td align="center" bgcolor="white" border="0">
          <! –– place your content here -->
        </td>
      </table> 
    </td>
  </table>
  ```
- Using a lot of `<div>` elements is generally to be avoided, even though I did not face any major issue.
- Support for Cascading Style Sheets (CSS) is limited for HTML in emails. Hence, inline styling is the way forward. 
  - Special note: Gmail **does not** render your custom font faces. 
- The standard width if you are looking for impressive looking HTML in email is `600px`. It scales well on mobile devices as well.
  - It should be mentioned as `width="600"` and not `width="600px"` 
- Another issue I faced was sending mails to Outlook. Outlook (generally) only accepts `text` emails—meaning your `html` templates will not be accepted, or will be blocked by Outlook by default. The client needs to manually allow the email to show images and other content.

Generally, it is challenging to figure out the perfect styling for your HTML in emails. But, a bit of searching and experimenting can get you the look you require.