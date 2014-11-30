define(['dojo/_base/declare', 'dojo/Stateful'], function (declare, Stateful) {
    return declare([Stateful], {
        id: null,
        layer: null,
        type: null,
        url: null,
        options: {}
    });
});