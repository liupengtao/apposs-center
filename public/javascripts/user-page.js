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
                    width:300,
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
                    width:300,
                    id:'commands' + id,
                    layout:'anchor',
                    frame:true
                },
                {
                    title:'命令组',
                    flex:1,
                    id:'cmdGroup' + id,
                    width:300,
                    layout:'anchor',
                    frame:true
                }
            ]
        }

        //应用的中心命令执行状态面板
        //操作模型的定义
        Ext.define('Operation', {
            extend:'Ext.data.Model',
            fields:['id','name','status']
        });
        //操作数据store的获取
        var operationStore = Ext.create('Ext.data.Store', {
            model:Operation,
            proxy:{
                type:'ajax',
                url:'/apps/1/commands.json',
                reader:{
                    type:'json',
                    record:'operation'
                }
            },
            autoLoad:true
        })
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
        }
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
        }
        appPanels[appPanels.length] = appPanel;
    }

    var cmdSetStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data : [
            {"id":"1", "name":"Apache"},
            {"id":"2", "name":"Glassfish"},
            {"id":"3", "name":"Weblogic"}
        ]
    });

    var addCmdGroupWindow = Ext.create('Ext.Window', {
        title:'增加命令组',
        width:250,
        height:200,
        items:[
            Ext.create('Ext.form.Panel', {
                labelWidth:60,
                labelAlign:'right',
                frame:true,
                height:170,
                items:[
                    Ext.create('Ext.form.field.ComboBox', {
                        fieldLabel:'命令组',
                        store:cmdSetStore,
                        queryMode:'local',
                        displayField:'name',
                        valueField:'id',
                        anchor:'95%',
                        margin:'20 0 0 10',
                        autoScroll:true,
                        blankText:'请选择命令组...',
                        emptyText:'请选择命令组...',
                        editable:false,
                        allowBlank:false
                    })
                ],
                buttons:[
                    {
                        text:'增加',
                        handler:function() {
                            
                        }
                    }
                ]
            })
        ]
    });

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

            for (var i = 0; i <= obj.length; i++) {//此处还有点问题,有待解决
                //此处获取App的机器列表，url为apps/:id/machines
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/1/machines.json',
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
                            Ext.getCmp('machines' + id).add(machinesListLabel);
                        }
                    });
                })(i);
                //此处获取App的命令集列表，url为apps/:id/cmd_sets
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/' + id + '/cmd_sets.json',
                        callback:function(options, success, response) {
                            var cmdSetStr = response.responseText;
                            var cmdSet = Ext.decode(cmdSetStr);
                            var cmdSetPanel = [];
                            for (var j = 0,len = cmdSet.length; j < len; j++) {
                                cmdSetPanel[cmdSetPanel.length] = {
                                    xtype:'panel',
                                    border:false,
                                    layout:'column',
                                    anchor:'100%',
                                    frame:true,
                                    items: [
                                        {
                                            xtype:'label',
                                            columnWidth:1 / 2,
                                            html:cmdSet[j].command.name
                                        },
                                        {
                                            columnWidth:0.5,
                                            xtype:'button',
                                            text:'执行',
                                            handler:function() {
                                                Ext.Msg.alert('提示','命令已下发');
                                                //发送执行Ajax请求，url为apps/:id/cmd_sets/cmd_set_def_id
                                                Ext.Ajax.request({
                                                    url:'/apps/' + id + '/cmd_sets',
                                                    params:{
                                                        cmd_set_def_id:(function(cmd_set_def_id) {
                                                            return cmd_set_def_id;
                                                        })(j)
                                                    },
                                                    callback:function(options, success, response) {

                                                    }
                                                });
                                            }
                                        }
                                    ]
                                }
                            }
                            Ext.getCmp('commands' + id).add(cmdSetPanel);
                        }
                    });
                })(i);
                //此处获取App的命令组列表，url为apps/:id/cmd_groups
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/1/cmd_groups.json',
                        callback:function(options, success, response) {
                            var cmdGroupStr = response.responseText;
                            var cmdGroup = Ext.decode(cmdGroupStr);
                            var cmdGroupPanel = [];
                            for (var j = 0,len = cmdGroup.length; j < len; j++) {
                                cmdGroupPanel[cmdGroupPanel.length] = {
                                    xtype:'panel',
                                    border:false,
                                    layout:'column',
                                    anchor:'100%',
                                    id:'cmdGroup' + id + j,
                                    frame:true,
                                    items: [
                                        {
                                            xtype:'label',
                                            columnWidth:1 / 2,
                                            html:cmdGroup[j].cmd_group.name
                                        },
                                        {
                                            columnWidth:0.5,
                                            xtype:'button',
                                            id:'deleteCmdGroupButton' + id + j,
                                            text:'删除'
                                        }
                                    ]
                                }
                            }

                            cmdGroupPanel[cmdGroupPanel.length] = {
                                xtype:'panel',
                                border:false,
                                layout:'column',
                                anchor:'100%',
                                frame:true,
                                items: [
                                    {
                                        xtype:'label',
                                        columnWidth:1 / 2,
                                        html:'&nbsp;'
                                    },
                                    {
                                        columnWidth:0.5,
                                        xtype:'button',
                                        text:'增加',
                                        handler:function() {
                                            addCmdGroupWindow.show();
                                        }
                                    }
                                ]
                            }
                            Ext.getCmp('cmdGroup' + id).add(cmdGroupPanel);
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