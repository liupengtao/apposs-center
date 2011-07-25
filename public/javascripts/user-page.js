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
        };

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

    //增加命令集
    function addCmdSet(appId) {
        //请求获取命令组数据并解析
        var cmdGroupNodes = [];
        Ext.Ajax.request({
            url:'/cmd_groups',
            callback:function(options, success, response) {
                var cmdGroups = Ext.decode(response.responseText);
                for (var i = 0; i < cmdGroups.length; i++) {
                    var cmdGroupNode = {};
                    var cmdGroup = cmdGroups[i];
                    cmdGroupNode.id = 'cmd_group' + cmdGroup.cmd_group.id;
                    cmdGroupNode.text = cmdGroup.cmd_group.name;

                    //为命令组增加命令
                    var cmdDefs = cmdGroup.cmd_group.cmd_defs;
                    if (cmdDefs.length == 0) {
                        cmdGroupNode.leaf = true;
                    } else {
                        var children = [];
                        for (var j = 0; j < cmdDefs.length; j++) {
                            var cmdDef = {};
                            cmdDef.id = 'cmd_def' + cmdDefs[j].id;
                            cmdDef.text = cmdDefs[j].name;
                            cmdDef.leaf = true;

                            children[children.length] = cmdDef;
                        }
                        cmdGroupNode.children = children;
                    }
                    cmdGroupNodes[cmdGroupNodes.length] = cmdGroupNode;
                }
                var cmdGroupStore = Ext.create('Ext.data.TreeStore', {
                    root: {
                        text: '命令组列表',
                        expanded: true,
                        children:cmdGroupNodes
                    },
                    folderSort: true,
                    sorters: [
                        {
                            property: 'id',
                            direction: 'ASC'
                        }
                    ]
                });

                //系统所有的命令组树
                var cmdGroupTreePanel = Ext.create('Ext.tree.Panel', {
                    title: '当前系统所有命令',
                    region:'west',
                    store:cmdGroupStore,
                    width:200,
                    autoScroll:true,
                    collapsible:true,
                    viewConfig: {
                        plugins: {
                            ptype: 'treeviewdragdrop',
                            enableDrop:false
                        }
                    },
                    listeners:{
                        beforeitemremove:function(parent, node) {
                            var nextSibling = node.nextSibling;
                            var newNode = node.copy(node.id);
                            if (node.isLeaf() == false) {
                                node.eachChild(function(child) {
                                    newNode.appendChild(child.copy(child.id));
                                });
                            }
                            if (nextSibling) {
                                parent.insertBefore(newNode, nextSibling);
                            } else {
                                parent.appendChild(newNode);
                            }
                        }
                    }
                });

                //增加命令到命令集
                function addCmdSet() {
                    var expression = '';
                    //获取命令集表达式
                    cmdSetTreePanel.getRootNode().eachChild(function(child) {
                        var data = child.data;
                        expression += data.id.substring(data.id.length - 1, data.id.length) + (data.allowFailure == true ? '|true' : '');
                        if (!child.isLast()) {
                            expression += ',';
                        }
                    });
                    alert(expression)
                    //更新命令集
                    Ext.Ajax.request({
                        url:'/apps/' + appId + '/cmd_set_defs',
                        method:'POST',
                        params:{
                            name:Ext.getCmp('cmdSetName').value,
                            expression:expression
                        },
                        callback:function(options, success, response) {
                            alert(success);
                            alert(response.responseText)
                        }
                    });
                }

                var cmdSetTreeStore = Ext.create('Ext.data.TreeStore', {
                    root: {
                        text: '',
                        expanded: true
                    },
                    fields:['id','text','allowFailure']
                });

                //命令包树
                var cmdSetTreePanel = Ext.create('Ext.tree.Panel', {
                    title:'命令包所有命令',
                    collapsible:true,
                    region:'center',
//                    rootVisible:false,
                    viewConfig: {
                        plugins: {
                            ptype: 'treeviewdragdrop'
                        }
                    },
                    autoScroll:true,
                    listeners:{
                        //向命令包中增加命令
                        beforeiteminsert:function(parent, node, refNode) {
                            if (node.isLeaf() == true) {
                                parent.remove(node);
                            }
                        },
                        itemappend:function(parent, node, index) {
                        }
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            iconCls:'add',
                            text: '保存',
                            handler:function() {
                                var name = Ext.getCmp('cmdSetName').value;
                                if (!name || name.length == 9) {
                                    Ext.Msg.alert('提醒', '请输入命令集的名字！');
                                    return;
                                }
                                cmdSetTreePanel.getRootNode().commit();
//                                addCmdSet();
                                Ext.getCmp('savedStatus').setText('命令集增加成功');
                                this.setDisabled(true);
                            }
                        }
                    ],
                    store:cmdSetTreeStore,
                    columns: [
                        {
                            xtype:'treecolumn',
                            text: '命令',
                            width:220,
                            dataIndex: 'text'
                        },
                        {
                            xtype:'checkcolumn',
                            text: '允许失败',
                            dataIndex: 'allowFailure'
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 20,
                            items: [
                                {
                                    icon   : '/images/delete.gif',
                                    tooltip: '删除当前命令',
                                    handler: function(tree, rowIndex, colIndex) {
                                        var root = this.up('treepanel').getRootNode();
                                        if (rowIndex == 0) {
                                            root.removeAll();
                                        } else {
                                            var nodeToDeleted = root.getChildAt(rowIndex - 1);
                                            nodeToDeleted.remove();
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                });

                //显示命令包树的信息
                var cmdSetPanel = Ext.create('Ext.panel.Panel', {
                    title:'命令包',
                    region:'center',
                    collapsible:true,
                    layout:'border',
                    items:[
                        {
                            layout:'column',
                            frame:true,
                            region:'north',
                            items:[
                                {
                                    xtype:'textfield',
                                    fieldLabel:'命令包名',
                                    id:'cmdSetName',
                                    columnWidth:0.5,
                                    enableKeyEvents:true,
                                    listeners:{
                                        keyup:function(field) {
                                            cmdSetTreePanel.getRootNode().set('text', field.getValue());
                                        }
                                    }
                                },
                                {
                                    xtype:'label',
                                    columnWidth:0.5,
                                    id:'savedStatus'
                                }
                            ]
                        },
                        cmdSetTreePanel
                    ]
                });
                var addCmdSetWin = Ext.create('Ext.Window', {
                    title:'增加命令集',
                    layout: {
                        type: 'border',
                        padding: 5
                    },
                    defaults: {
                        split: true
                    },
                    items: [
                        cmdGroupTreePanel,
                        cmdSetPanel
                    ],
                    width:700,
                    height:500
                });
                addCmdSetWin.show();
            }
        });
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
                        url:'/apps/' + id + '/machines',
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
                })(obj[i].app.id);
                //此处获取App的命令集列表，url为apps/:id/cmd_set_defs
                (function(id) {
                    Ext.Ajax.request({
                        url:'/apps/' + id + '/cmd_set_defs',
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
                                                                        width:720,
                                                                        height:544,
                                                                        autoScroll:true,
                                                                        items:[
                                                                            {
                                                                                autoScroll:true,
                                                                                html:getIFrameForEditCmdSet(respondUrl, 700, 500)
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
                            //增加命令集面板
                            cmdSetPanel[cmdSetPanel.length] = {
                                xtype:'panel',
                                layout:'column',
                                border:false,
                                anchor:'100%',
                                frame:true,
                                items:[
                                    {
                                        xtype:'label',
                                        columnWidth:0.5,
                                        html:'&nbsp;'
                                    },
                                    {
                                        xtype:'button',
                                        text:'增加',
                                        id:'appAddButton' + id,
                                        columnWidth:0.5,
                                        handler:function() {
                                            addCmdSet(this.id.substring(this.id.length - 1));
                                        }
                                    }
                                ]
                            }
                            Ext.getCmp('commands' + id).add(cmdSetPanel);
                        }
                    });
                })(obj[i].app.id);
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