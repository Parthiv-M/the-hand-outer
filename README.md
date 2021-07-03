# The Hand-Outer

A _hand-outer_ application that does what it claims—hand out newsletters in this case. This hand-outer doles out a copy of the newsletter to every subscriber's email address (which is fetched from the database via an API) every week, scheduled by [node-cron](https://www.npmjs.com/package/node-cron) and powered by [nodemailer](https://www.npmjs.com/package/nodemailer).

## A general use-case

This project can be used in a general scenario as well. Instead of being limited to just sending e-mails, it can be configured to repeat menial tasks automatically at specified intervals of time. Replacing parts of the code with your own to-be-repeated operation will do the trick. In this specific case, I have leveraged [express](https://expressjs.com/) to make use of a few of its functionalities. But even that can be avoided, if required, since a normal script involving node-cron can also be used in several other specific use-cases.

## Points to note for HTML in email

I stumbled quite a bit while setting this up for myself, and want to note down a few points for general consideration. 

- While setting up scheduled e-mailers for a variety of content, it is best to use some form of server side templating engine if you want dynamic code injection, since executing a script before sending across the html might prove to be quite a task.
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
- Another issue I faced was sending mails to Outlook. Outlook only accepts `text` emails—meaning `html` templates are not accepted.

Generally, it is challenging to figure out the perfect styling for your HTML in emails. But, a bit of searching and experimenting can get you the look you require.