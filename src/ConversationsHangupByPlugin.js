import React from 'react';
import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'ConversationsHangupByPlugin';

export default class ConversationsHangupByPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {

    let currentReservation;
    
    manager.workerClient.on('reservationCreated', reservation => {
      currentReservation = reservation;
    });

    manager.voiceClient.on("disconnect", () => {

      if(currentReservation) {
      
        !('conversations' in currentReservation.task.attributes) && (currentReservation.task.attributes.conversations = {});
        
        if(currentReservation.task.attributes.conversations.hang_up_by === undefined){

            currentReservation.task.attributes.conversations.hang_up_by = 'Customer';
            currentReservation.task.setAttributes(currentReservation.task.attributes);

        }

        currentReservation = null;

      }
        
    });
      

    flex.Actions.addListener("afterHangupCall", (payload) => {

      !('conversations' in payload.task.attributes) && (payload.task.attributes.conversations = {});
      payload.task.attributes.conversations.hang_up_by = 'Agent';
      payload.task.setAttributes(payload.task.attributes);

      currentReservation = null;

    });

  }

}
