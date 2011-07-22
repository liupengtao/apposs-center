/**
 * Created by JetBrains RubyMine.
 * User: liupengtao.pt
 * Date: 11-7-17
 * Time: 下午6:38
 * To change this template use File | Settings | File Templates.
 */
Ext.onReady(function() {
    //Application Panel array
    var appPanels = [];

    //Current User Application TabPanel
    var appTabPanel = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame:true,
        split:true
    });

    //应用的中心命令执行状态面板
    //操作模型的定义
    Ext.define('Operation', {
        extend:'Ext.data.Model',
        fields:['id','name','status']
    });

    //Add Current User's Application to the appPanels array.
    function addAppTabPanel(name, id) {
        //应用的左侧面板
        var appLeftPanel = {
            title:name,
            layout:'vbox',
            frame:true,
            split:true,
            autoScroll:true,
            collapsible:true,
            region:'west',
            items:[
                {
                    title:'基本信息',
                    width:400,
                    flex:1,
                    frame:true,
                    items:[
                        {
                            title:'机器列表',
                            frame:true,
                            xtype:'fieldset',
                            layout:'column',
                            id:'machines' + id
                        }
                    ]
                },
                {
                    title:'命令集',
                    flex:1,
                    width:400,
                    id:'commands' + id,
                    layout:'anchor',
                    frame:true
                }
            ]
        }

        //操作数据store的获取
        var operationStore = Ext.create('Ext.data.Store', {
            model:Operation,
            proxy:{
                type:'ajax',
                url:'apps/' + id + '/commands',
                reader:{
                    type:'json',
                    record:'operation'
                }
            },
            autoLoad:true
        });
        var appCenterPanel = {
            xtype:'gridpanel',
            store:operationStore,
            frame:true,
            region:'center',
            title:'当前应用的命令执行状态',
            columns: [
                {
                    header:'命令名',
                    dataIndex:'name'
                },
                {
                    header:'命令执行状态',
                    dataIndex:'status'
                }
            ]
        };
        //应用的总面板
        var appPanel = {
            title:name,
            xtype:'panel',
            layout:'border',
            split:true,
            collapsible:true,
            items:[
                appLeftPanel,
                appCenterPanel
            ]
        };
        appPanels[appPanels.length] = appPanel;
    }

    //构造iframe标签
    function getIFrameForEditCmdSet(url, width, height) {
        return '<iframe src="' + url + ' " width="' + width + '" height="' + height + '"' +
            '></iframe>'
    }

    //Request Current User's Applications
    Ext.Ajax.request({
        url:'/apps',
        callback:function(options, success, response) {
            var result = response.responseText;
            var obj = Ext.decode(result);
            for (var i = 0; i < obj.length; i++) {
                addAppTabPanel(obj[i].app.name, obj[i].app.id);
            }
            appTabPanel.add(appPanels);//Add to addTabPanel

            for (var i = 0; i < obj.length; i++) {
                //此处获取App的机器列表，url为apps/:id/machines
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/' + (id + 1) + '/machines',
                        callback:function(options, success, response) {
                            var machinesStr = response.responseText;
                            var machines = Ext.decode(machinesStr);
                            var machinesListLabel = [];
                            for (var j = 0,len = machines.length; j < len; j++) {
                                machinesListLabel[machinesListLabel.length] = {
                                    xtype:'label',
                                    html:machines[j].machine.name,
                                    columnWidth:1
                                }
                            }
                            Ext.getCmp('machines' + (id + 1)).add(machinesListLabel);
                        }
                    });
                })(i);
                //此处获取App的命令集列表，url为apps/:id/cmd_set_defs
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/' + (id + 1) + '/cmd_set_defs',
                        callback:function(options, success, response) {
                            var cmdSetStr = response.responseText;
                            var cmdSet = Ext.decode(cmdSetStr);
                            var cmdSetPanel = [];
                            for (var j = 0,len = cmdSet.length; j < len; j++) {
                                var columnCount = cmdSet[j].actions.length + 1;
                                var cmdSetPanelCmps = [];
                                cmdSetPanelCmps[cmdSetPanelCmps.length] = {
                                    xtype:'label',
                                    columnWidth:1 / columnCount,
                                    html:cmdSet[j].name
                                };
                                for (var k = 1; k < columnCount; k++) {
                                    cmdSetPanelCmps[cmdSetPanelCmps.length] = {
                                        columnWidth:1 / columnCount,
                                        xtype:'button',
                                        text:cmdSet[j].actions[k - 1].name,
                                        handler:
                                            (function(url, method, type) {
                                                return function() {
                                                    Ext.Ajax.request({
                                                        url:url,
                                                        method:method,
//                                                        params:{
//                                                            cmd_set_def_id:cmdSetId
//                                                        },
                                                        callback:(function(type) {
                                                            return function(options, success, response) {
                                                                if (type == 'simple') {
                                                                    Ext.Msg.alert('消息', response.responseText);
                                                                } else if (type == 'multi') {
                                                                    var respondUrl = Ext.decode(response.responseText).url;
                                                                    var multiWin = Ext.create('Ext.Window', {
                                                                        width:window.innerWidth - 300,
                                                                        height:window.innerHeight - 300,
                                                                        autoScroll:true,
                                                                        items:[
                                                                            {
                                                                                autoScroll:true,
                                                                                html:getIFrameForEditCmdSet(respondUrl, window.innerWidth - 300, window.innerHeight - 300)
                                                                            }
                                                                        ]
                                                                    });
                                                                    multiWin.show();
                                                                }
                                                            }
                                                        })(type)
                                                    })
                                                }
                                            })(cmdSet[j].actions[k - 1].url, cmdSet[j].actions[k - 1].method, cmdSet[j].actions[k - 1].type)
                                    }
                                }
                                cmdSetPanel[cmdSetPanel.length] = {
                                    xtype:'panel',
                                    border:false,
                                    layout:'column',
                                    anchor:'100%',
                                    frame:true,
                                    items: [
                                        cmdSetPanelCmps
                                    ]
                                }
                            }
                            Ext.getCmp('commands' + (id + 1)).add(cmdSetPanel);
                        }
                    });
                })(i);
            }
        }
    });

    //The Welcome bar in the top
    var welcomePanel = {
        region:'north',
        contentEl:'north',
        frame:true
    };

    //The main panel
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
            welcomePanel,
            appTabPanel
        ]
    });
});