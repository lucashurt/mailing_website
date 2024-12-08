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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(res => res.json())
      .then(email => {
        email.forEach(individual_email => {
          const element = document.createElement('div');
          element.className = "row";
          element.style.border="1px solid black"
          element.style.justifyContent="space-between";

          const sender = document.createElement('div');
          sender.innerHTML = individual_email.sender;
          sender.style.fontWeight="bold";
          sender.style.marginRight="5%";

          const subject = document.createElement('div');
          subject.innerHTML = individual_email.subject;
          subject.style.border="1px solid black"
          subject.style.textAlign="center"

          const left_side = document.createElement('div');
          left_side.className = "row";
          left_side.append(sender);
          left_side.append(subject);
          left_side.style.paddingLeft="2%";
          left_side.style.width="70%"

          const timestamp = document.createElement('div');
          timestamp.innerHTML = individual_email.timestamp;
          timestamp.style.color = "grey";


          element.append(left_side)
          element.append(timestamp)

          element.addEventListener('click', () => console.log("clicked"));
          document.querySelector('#emails-view').append(element);
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

