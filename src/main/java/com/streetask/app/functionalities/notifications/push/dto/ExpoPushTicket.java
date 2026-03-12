package com.streetask.app.functionalities.notifications.push.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpoPushTicket {

    private String status;
    private String id;
    private String message;
    private ExpoPushTicketDetails details;
}