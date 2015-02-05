define([
 'dojo/_base/declare',
 'dojo/text!./sidebar/templates/Sidebar.html',
 'dojo/_base/lang',
 'dojo/_base/array',
 'dojo/dom-class',
 'dojo/dom-geometry',
 'dojo/on',

 'dijit/_WidgetBase',
 'dijit/_TemplatedMixin',

 'put-selector/put',

 'core/models/appModel',

 'xstyle/css!./Sidebar/css/Sidebar.css'
], function (
    declare, template, lang, array, domClass, domGeom, on,

    _WidgetBase, _TemplatedMixin,

    put,

    appModel
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'sidebar',
        defaultTabParams: {
            tabIcon: 'fa-bars',
            tabTitle: 'Title'
        },
        collapseSyncNode: null,
        postCreate: function () {
            this.inherited(arguments);
            this.init();
        },
        init: function () {
            this.tabs = [];
            if (this.collapseSyncNode && domClass.contains(this.domNode, 'collapsed')) {
                put(this.collapseSyncNode, '.collapsed');
            }
            //wire up css transition callback covering all event name bases
            on(this.collapseSyncNode, 'transitionend, oTransitionEnd, webkitTransitionEnd, animationend, webkitAnimationEnd', lang.hitch(this, '_setViewPadding'));
        },
        createTab: function (params) {
            params = lang.mixin(lang.clone(this.defaultTabParams), (params || {}));
            var tab = {
                buttonNode: null,
                containerNode: null,
                closeBtnNode: null
            };
            //create and place dom elements for the tab button and pane
            tab.buttonNode = put(this.tabsButtonNode, 'li a[role=tab] i.fa.' + params.tabIcon + '<<');
            tab.containerNode = put(this.tabsContainerNode, 'div.' + this.baseClass + '-pane div.sidebar-pane-title $ <', params.tabTitle);
            // tab.containerNode = put(this.tabsContainerNode, 'div.' + this.baseClass + '-pane');
            tab.closeBtnNode = put(tab.containerNode, 'i.fa.fa-times.closeIcon');
            // listen for the tab close button click
            on(tab.closeBtnNode, 'click', lang.hitch(this, 'tabClickHandler', tab));
            // listen for the tab button click
            on(tab.buttonNode, 'click', lang.hitch(this, 'tabClickHandler', tab));
            //keep a refrence to this tab
            this.tabs.push(tab);
            //return the tabs pane node
            return tab;
        },
        tabClickHandler: function (tab) {
            if (domClass.contains(tab.buttonNode, 'active')) {
                this.closeTab(tab);
            } else {
                this.openTab(tab);
            }
        },
        _setViewPadding: function () {
            var dims = domGeom.getContentBox(this.domNode);
            appModel.set('viewPadding', {
                top: 0,
                left: dims.w + dims.l,
                right: 0,
                bottom: 0
            });
        },
        openTab: function (tab) {
            array.forEach(this.tabs, function (tab) {
                put(tab.buttonNode, '!active');
                put(tab.containerNode, '!active');
            });
            put(tab.buttonNode, '.active');
            put(tab.containerNode, '.active');
            put(this.tabsButtonNode, '.active');
            put(this.domNode, '!collapsed');
            if (this.collapseSyncNode) {
                put(this.collapseSyncNode, '!collapsed');
            }
        },
        closeTab: function () {
            array.forEach(this.tabs, function (tab) {
                put(tab.buttonNode, '!active');
                put(this.tabsButtonNode, '!active');
                put(tab.containerNode, '!active');
            }, this);
            put(this.domNode, '.collapsed');
            if (this.collapseSyncNode) {
                put(this.collapseSyncNode, '.collapsed');
            }
        }
    });
});