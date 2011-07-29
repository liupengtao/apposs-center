/**
 * Created by JetBrains RubyMine.
 * User: liupengtao.pt
 * Date: 11-7-25
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */
//The Welcome bar in the top
Ext.onReady(function() {
    var welcomePanel = {
        region:'north',
        contentEl:'north',
        frame:true
    };

    var adminMenus = [];

    function addAdminMenu(id, text, leaf) {
        adminMenus[adminMenus.length] = {
            id:id,
            text:text,
            leaf:leaf
        };
    }

    addAdminMenu(0, '用户信息管理', true);
    addAdminMenu(1, '角色管理', true);
    addAdminMenu(2, '命令管理', true);
    addAdminMenu(3, '命令组管理', true);
    addAdminMenu(4, '应用管理', true);
    addAdminMenu(5, '机器和机房管理', true);

    //管理菜单树
    var adminMenuTreeStore = Ext.create('Ext.data.TreeStore', {
        root:{
            expanded:true,
            children:adminMenus
        }
    });
    var adminMenuTreePanel = Ext.create('Ext.tree.Panel', {
        title:'管理菜单',
        region:'west',
        bodyCls:'admin_nav_menu',
        rootVisible:false,
        split:true,
        collapsible:true,
        width:220,
        store:adminMenuTreeStore
    });

    //用户信息管理面板
    var userInfoPanel = {
        id:'0',
        title:'用户信息管理'
    };
    //角色管理面板
    var rolePanel = {
        id:'1',
        title:'角色管理'
    };

    //命令Model
    Ext.define('CmdDef', {
        extend:'Ext.data.Model',
        fields:['id','name','alias','arg1','arg2','arg3','arg4','arg5','cmd_group_id'],
        proxy:{
            type:'ajax',
            url:'/admin/cmd_defs',
            reader:'json',
            extraParams: {
                authenticity_token:$('meta[name="csrf-token"]').attr('content')
            }
        }
    });

    //命令的GridPanel Store
    var cmdDefGridStore = Ext.create('Ext.data.Store', {
        model:CmdDef,
        autoLoad:true
    });

    //命令组Model
    Ext.define('CmdGroup', {
        extend:'Ext.data.Model',
        fields:['id','name'],
        proxy:{
            type:'ajax',
            url:'/admin/cmd_groups',
            reader:'json'
        }
    });

    //编辑命令中的命令组Combo的Store
    var editCmdDefCmdGroupComboStore = Ext.create('Ext.data.Store', {
        model:CmdGroup,
        autoLoad:true
    });
    editCmdDefCmdGroupComboStore.load();
    //增加命令时对应的命令组
    var addCmdDefCmdGroupComboStore = Ext.create('Ext.data.Store', {
        model:CmdGroup,
        autoLoad:true
    });
    //编辑命令组中的数据store
    var cmdGroupGridStore = Ext.create('Ext.data.Store', {
        model:CmdGroup,
        autoLoad:true
    });
    //命令中的命令组renderer
    function cmdGroupRender(value) {
        var comboRecord = editCmdDefCmdGroupComboStore.getById(value);
        if (comboRecord) {
            return comboRecord.get('name');
        }
        return value;
    }

    var cmdDefPanelRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1
    });
    var cmdGroupPanelRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1
    });
    //命令管理面板
    var cmdDefPanel = Ext.create('Ext.form.Panel', {
        frame:true,
        id:'2',
        title:'命令管理',
        bodyPadding:5,
        layout:'border',
        split:true,
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        items: [
            {
                region:'center',
                xtype: 'gridpanel',
                title:'当前系统所有命令',
                store:cmdDefGridStore,
                split:true,
                columnLines:true,
                viewConfig: {
                    stripeRows: true
                },
                selType: 'rowmodel',
                plugins: [
                    cmdDefPanelRowEditing
                ],
                columns:[
                    {
                        text:'命令名',
                        dataIndex:'name',
                        flex:6,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    },
                    {
                        text:'别名',
                        dataIndex:'alias',
                        flex:6,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'参数1',
                        dataIndex:'arg1',
                        flex:2,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'参数2',
                        dataIndex:'arg2',
                        flex:2,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'参数3',
                        dataIndex:'arg3',
                        flex:2,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'参数4',
                        dataIndex:'arg4',
                        flex:2,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'参数5',
                        dataIndex:'arg5',
                        flex:2,
                        editor: {
                            xtype:'textfield'
                        }
                    },
                    {
                        text:'命令组',
                        dataIndex:'cmd_group_id',
                        flex:4,
                        editor: {
                            xtype:'combo',
                            name:'cmd_group_id',
                            valueField:'id',
                            displayField:'name',
                            store:editCmdDefCmdGroupComboStore,
//                            allowBlank: false,
                            editable:false
                        },
                        renderer:cmdGroupRender
                    },
                    {
                        flex:1,
                        xtype: 'actioncolumn',
                        items: [
                            {
                                icon   : '/images/delete.gif',
                                tooltip: '删除当前命令',
                                handler: function(grid, rowIndex, colIndex) {
                                    var r = cmdDefGridStore.getAt(rowIndex);
                                    Ext.Ajax.request({
                                        url:'/admin/cmd_defs/' + r.get('id'),
                                        method:'DELETE',
                                        params:{
                                            authenticity_token:$('meta[name="csrf-token"]').attr('content')
                                        },
                                        callback:function (options, success, response) {

                                        }
                                    });
                                    cmdDefGridStore.remove(r);
                                    cmdDefGridStore.reload();
                                }
                            }
                        ]
                    }
                ],
                tbar: [
                    {
                        text: '增加命令',
                        iconCls:'add',
                        handler : function() {
                            var addCmdDefWin = Ext.create('Ext.Window', {
                                title:'增加命令',
                                layout:'border',
                                width:500,
                                items:[
                                    Ext.create('Ext.form.Panel', {
                                        region:'center',
                                        frame:'true',
                                        url:'/admin/cmd_defs',
                                        defaultType:'textfield',
                                        defaults: {
                                            labelWidth:90,
                                            anchor:'95%'
                                        },
                                        items:[
                                            {
                                                xtype:'hidden',
                                                name:'authenticity_token',
                                                value:$('meta[name="csrf-token"]').attr('content')
                                            },
                                            {
                                                fieldLabel:'命令名',
                                                name:'cmd_def[name]',
                                                allowBlank:false,
                                                blankText:'命令名不能为空'
                                            },
                                            {
                                                fieldLabel:'别名',
                                                name:'cmd_def[alias]'
                                            },
                                            {
                                                fieldLabel:'参数1',
                                                name:'cmd_def[arg1]'
                                            },
                                            {
                                                fieldLabel:'参数2',
                                                name:'cmd_def[arg2]'
                                            },
                                            {
                                                fieldLabel:'参数3',
                                                name:'cmd_def[arg3]'
                                            },
                                            {
                                                fieldLabel:'参数4',
                                                name:'cmd_def[arg4]'
                                            },
                                            {
                                                fieldLabel:'参数5',
                                                name:'cmd_def[arg5]'
                                            },
                                            {
                                                fieldLabel:'命令组',
                                                xtype:'combo',
                                                name:'cmd_def[cmd_group_id]',
                                                valueField:'id',
                                                displayField:'name',
                                                store:addCmdDefCmdGroupComboStore,
                                                editable:false
                                            }
                                        ],
                                        buttons:[
                                            {
                                                text:'保存',
                                                handler:function() {
                                                    var form = this.up('form').getForm();
                                                    if (form.isValid()) {
                                                        form.submit({
                                                            success: function(form, action) {
                                                                cmdDefGridStore.load();
                                                                addCmdDefWin.close();
                                                            },
                                                            failure: function(form, action) {
                                                                cmdDefGridStore.load();
                                                                addCmdDefCmdGroupComboStore.load();
                                                                addCmdDefWin.close();
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                text:'重设',
                                                handler:function() {
                                                    this.up('form').getForm().reset();
                                                }
                                            }
                                        ]
                                    })
                                ]
                            });
                            addCmdDefWin.show();
                        }
                    }
                ],
                listeners: {
                    edit:function(editor, e) {
                        editor.record.commit();
                        var record = editor.record;
                        Ext.Ajax.request({
                            url:'/admin/cmd_defs/' + record.get('id'),
                            method:'PUT',
                            params:{
                                authenticity_token:$('meta[name="csrf-token"]').attr('content'),
                                'cmd_def[name]':record.get('name'),
                                'cmd_def[alias]':record.get('alias'),
                                'cmd_def[arg1]':record.get('arg1'),
                                'cmd_def[arg2]':record.get('arg2'),
                                'cmd_def[arg3]':record.get('arg3'),
                                'cmd_def[arg4]':record.get('arg4'),
                                'cmd_def[arg5]':record.get('arg5'),
                                'cmd_def[cmd_group_id]':record.get('cmd_group_id')
                            },
                            callback:function(options, success, response) {

                            }
                        });
                    }
                }
            }
        ]
    });
    //命令组管理面板
    var cmdGroupDefPanel = {
        frame:true,
        id:'3',
        title:'命令组管理',
        bodyPadding:5,
        layout:'border',
        split:true,
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        items: [
            {
                region:'center',
                xtype: 'gridpanel',
                title:'当前系统所有命令组',
                store:cmdGroupGridStore,
                split:true,
                columnLines:true,
                viewConfig: {
                    stripeRows: true
                },
                selType: 'rowmodel',
                plugins: [
                    cmdGroupPanelRowEditing
                ],
                columns:[
                    {
                        text:'命令组名',
                        dataIndex:'name',
                        flex:16,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    },
                    {
                        flex:1,
                        xtype: 'actioncolumn',
                        items: [
                            {
                                icon   : '/images/delete.gif',
                                tooltip: '删除当前命令组',
                                handler: function(grid, rowIndex, colIndex) {
                                    var r = cmdGroupGridStore.getAt(rowIndex);
                                    Ext.Ajax.request({
                                        url:'/admin/cmd_groups/' + r.get('id'),
                                        method:'DELETE',
                                        params:{
                                            authenticity_token:$('meta[name="csrf-token"]').attr('content')
                                        },
                                        callback:function (options, success, response) {

                                        }
                                    });
                                    cmdGroupGridStore.remove(r);
                                    cmdGroupGridStore.reload();
                                }
                            }
                        ]
                    }
                ],
                tbar: [
                    {
                        text: '增加命令组',
                        iconCls:'add',
                        handler : function() {
                            var addCmdGroupWin = Ext.create('Ext.Window', {
                                title:'增加命令组',
                                layout:'border',
                                width:300,
                                height:150,
                                items:[
                                    Ext.create('Ext.form.Panel', {
                                        region:'center',
                                        frame:'true',
                                        url:'/admin/cmd_groups',
                                        defaultType:'textfield',
                                        defaults: {
                                            labelWidth:90,
                                            anchor:'95%'
                                        },
                                        items:[
                                            {
                                                xtype:'hidden',
                                                name:'authenticity_token',
                                                value:$('meta[name="csrf-token"]').attr('content')
                                            },
                                            {
                                                fieldLabel:'命令组名',
                                                name:'cmd_group[name]',
                                                allowBlank:false,
                                                blankText:'命令组名不能为空'
                                            }
                                        ],
                                        buttons:[
                                            {
                                                text:'保存',
                                                handler:function() {
                                                    var form = this.up('form').getForm();
                                                    if (form.isValid()) {
                                                        form.submit({
                                                            success: function(form, action) {
                                                                cmdGroupGridStore.load();
                                                                addCmdGroupWin.close();
                                                            },
                                                            failure: function(form, action) {
                                                                cmdGroupGridStore.load();
                                                                addCmdGroupWin.close();
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                text:'重设',
                                                handler:function() {
                                                    this.up('form').getForm().reset();
                                                }
                                            }
                                        ]
                                    })
                                ]
                            });
                            addCmdGroupWin.show();
                        }
                    }
                ],
                listeners: {
                    edit:function(editor, e) {
                        editor.record.commit();
                        var record = editor.record;
                        Ext.Ajax.request({
                            url:'/admin/cmd_groups/' + record.get('id'),
                            method:'PUT',
                            params:{
                                authenticity_token:$('meta[name="csrf-token"]').attr('content'),
                                'cmd_group[name]':record.get('name')
                            },
                            callback:function(options, success, response) {

                            }
                        });
                    }
                }
            }
        ]
    };
    //应用管理面板
    var appPanel = {
        id:'4',
        title:'应用管理'
    };
    //机器和机房管理面板
    var roomMachinePanel = {
        id:'5',
        title:'机器和机房管理'
    };

    //管理操作区
    var adminOperationPanel = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'card',
        activeItem: 0,
        border:false,
        items:[
            userInfoPanel,
            rolePanel,
            cmdDefPanel,
            cmdGroupDefPanel,
            appPanel,
            roomMachinePanel
        ]
    });

    adminMenuTreePanel.getSelectionModel().on('select', function(selModel, record) {
        adminOperationPanel.layout.setActiveItem(record.get('id'));
    });

    Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split:true
        },
        items: [
            welcomePanel,
            adminMenuTreePanel,
            adminOperationPanel
        ]
    });
});
