'use strict';
const express = require('express');
const axios = require('axios');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const readJson = require('read-package-json');
const Promise = require('bluebird');
const Table = require('cli-table2');
let runner = require('./commandRunners');
let verifyUser = require('./actions/verifyUser');

const app = express();

const PORT = process.env.port || 5000;

// app.use(middleware.morgan('dev'));
// app.use(middleware.bodyParser.urlencoded({extended: false}));
// app.use(middleware.bodyParser.json());

// app.use(express.static(path.join(__dirname, '../public')));

// app.use('/', routes.auth);
// app.use('/api', middleware.auth.verifyElse401, routes.api);



/** TABLE DISPLAY FOR displayAllPanelTickets() **/
let displayAllMyPanelTicketsTable = new Table({
  head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
  colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
});


/** DISPLAY ALL OF USER'S TICKETS ASSOCIATED WITH A PANEL **/
const displayAllMyPanelTickets = () => {
  prompt(promptForPanelNameQuestion)
    .then(answer => {
      axios.get('http://localhost:3000/cli/mypaneltickets', {params: {api_key: api_key, board_id: board_id, user_id: user_id, github_handle: github_handle, panel_id: answer.panel_id }})
        .then(tickets => {

          tickets.data.forEach(ticket => {
            displayAllMyPanelTicketsTable.push([ticket.id, ticket.title, ticket.description, ticket.status, ticket.priority, ticket.type, ticket.assignee_handle, ticket.panel_id]);
          });
    
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompt();
        })

        .catch(error => {
          console.log('Error on getting Tickets for this Panel!');
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompt();
        });
    });
};


app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');
  
  verifyUser.verifyAPIKey();

});
