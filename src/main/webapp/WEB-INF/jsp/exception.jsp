<%@ page session="false" trimDirectiveWhitespaces="true" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
        <%@ taglib prefix="streetask" tagdir="/WEB-INF/tags" %>

            <streetask:layout pageName="error">

                <spring:url value="/resources/images/pets.png" var="petsImage" />
                <img src="${petsImage}" />

                <h2>Something happened...</h2>

                <p>${exception.message}</p>

            </streetask:layout>