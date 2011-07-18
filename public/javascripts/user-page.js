/**
 * Created by JetBrains RubyMine.
 * User: liupengtao.pt
 * Date: 11-7-17
 * Time: 下午6:38
 * To change this template use File | Settings | File Templates.
 */
Ext.onReady(function() {
    var welcomeInfoPanel = Ext.create('Ext.panel.Panel', {
        region: 'north',
        split: true,
        html: '<h1 style="float: right;font-size: 20px;">欢迎您</h1>',
        frame:true
    });

    var appPanel1 = {
        title: 'App1',
        layout:'vbox',
        split:true,
        items:[
            {
                title:'基本信息',
                width:300,
                flex:1,
                html:'Basic Info'
            },
            {
                title:'基本信息',
                flex:1,
                width:300,
                html:'Basic Info'
            },
            {
                title:'基本信息',
                flex:1,
                width:300,
                html:'Basic Info'
            }
        ]
    };

    var appPanel2 = {
        title: 'App2',
        layout:'border',
        split:true,
        collapsible:true,
        items:[
            {
                title:'App Info',
                region:'west',
                split:true,
                layout:'vbox',
                collapsible:true,
                width:300,
                items:[
                    {
                        title:'基本信息',
                        flex:1,
                        width:300,
                        html:'Basic Info'
                    },
                    {
                        title:'命令维护区域',
                        flex:1,
                        width:300,
                        html:'Basic Info'
                    },
                    {
                        title:'命令集显示区域',
                        flex:1,
                        width:300,
                        html:'Basic Info'
                    }
                ]
            },
            {
                title:'命令执行显示区',
                region:'center',
                collapsible:true,
                split:true,
                html:'命令执行显示区'
            }
        ]
    };

    var appTabPanel = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame:true,
        split:true,
        title:'App List',
        items: [
            appPanel1,
            appPanel2
        ]
    });

    var userMainPanel = Ext.create('Ext.Viewport', {
        renderTo:'main',
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split:true
        },
        items: [
            welcomeInfoPanel,
            appTabPanel
        ]
    });
});