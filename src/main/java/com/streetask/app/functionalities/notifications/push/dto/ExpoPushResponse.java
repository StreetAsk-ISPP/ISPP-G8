package com.streetask.app.functionalities.notifications.push.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpoPushResponse {

    private List<ExpoPushTicket> data;
}