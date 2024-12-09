document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#individual-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#individual-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(res => res.json())
      .then(email => {
        email.forEach(individual_email => {

          const button = document.createElement('button');
          button.className = "row";
          button.style.width="100%"

          const sender = document.createElement('p');
          sender.innerHTML = individual_email.sender;
          sender.style.fontWeight="bold";
          sender.style.marginRight="5%";

          const subject = document.createElement('p');
          subject.href = ``
          subject.style.color = "black";
          subject.innerHTML = individual_email.subject;

          const left_side = document.createElement('div');
          left_side.className = "row";
          left_side.style.paddingLeft="2%";
          left_side.style.width="70%"
          left_side.append(sender);
          left_side.append(subject);

          const timestamp = document.createElement('div');
          timestamp.innerHTML = individual_email.timestamp;
          timestamp.style.color = "grey";

          button.append(left_side);
          button.append(timestamp);

          button.addEventListener('click', () => load_email(individual_email.id));
          document.querySelector('#emails-view').append(button);
        })
      })
}

function send_email(event) {
  event.preventDefault();
  fetch('/emails',{
    method: 'POST',
    body: JSON.stringify({
      recipients:document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    load_mailbox('sent');
  })
}
function load_email(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#individual-email-view').style.display = 'block';

  document.querySelector('#individual-email-view').innerHTML='';

  fetch(`/emails/${id}`, {
   method: 'PUT',
   body: JSON.stringify({
   read: true
   })
   })

  fetch(`/emails/${id}`)
      .then(res => res.json())
      .then(email => {
        const element = document.createElement('div');

        const email_information = document.createElement('div');
        email_information.innerHTML = `<strong>From:</strong> ${email.sender} <br/> 
                                       <strong>To:</strong>${email.recipients} <br/>
                                       <strong>Subject:</strong> ${email.subject} <br/>
                                       <strong>Timestamp:</strong> ${email.timestamp} <br/>
                                       <button class = "btn btn-sm btn-outline-primary" type="submit"> Reply </button> <hr>
                                       <p>${email.body}</p>`

        let user_email = document.querySelector("h2").innerHTML
        if(user_email === email.sender){
          element.append(email_information)
        }

        else{
        const archive_button = document.createElement('button');
        archive_button.className = "btn btn-sm btn-outline-primary";

        if (email.archived ===false){
          archive_button.id = "archive"
          archive_button.innerHTML = 'Archive';
        }
        else{
          archive_button.id = "unarchive"
          archive_button.innerHTML = 'Unarchive';
        }

        archive_button.addEventListener('click', () => archive_email(email.id,archive_button.innerHTML))
        element.append(email_information);
        element.append(archive_button)}

        document.querySelector('#individual-email-view').append(element);
      })
}
function archive_email(id,action) {

  if(action === 'Archive'){
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived:true
      })
    })
  }
  else{
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived:false
      })
    })
  }
}
