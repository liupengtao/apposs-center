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
            type:'rest',
            url:'/admin/cmd_defs',
            reader:'json',
            extraParams: {
                authenticity_token:$('meta[name="csrf-token"]').attr('content')
            }
        },
        idProperty:'_id'
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

    //命令组Combo的Store
    var cmdGroupComboStore = Ext.create('Ext.data.Store', {
        model:CmdGroup,
        autoLoad:true
    });
    cmdGroupComboStore.load();
    //命令中的命令组renderer
    function cmdGroupRender(value) {
        var comboRecord = cmdGroupComboStore.getById(value);
        if (comboRecord) {
            return comboRecord.get('name');
        }
        return value;
    }

    var cmdDefPanelRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1
    });
    //命令管理面板
    var cmdDefPanel = Ext.create('Ext.form.Panel', {
        frame:true,
        id:'2',
        title:'命令管理',
        bodyPadding:5,
        layout:'border',
//        collapsible:true,
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
                        text:'命名名',
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
                            store:cmdGroupComboStore,
                            allowBlank: false
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
                                    cmdDefGridStore.remove(r);
                                    cmdDefGridStore.sync();
                                    r.destroy();
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
                            var r = Ext.ModelManager.create({
                            }, 'CmdDef');
                            cmdDefGridStore.add(r);
                            cmdDefPanelRowEditing.startEditByPosition({});
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
                                'cmd-def[cmd_group_id]':record.get('cmd_group_id')
                            },
                            callback:function(options,success,response) {
                                
                            }
                        });
                    }
                }
            }
        ]
    });
    //命令组管理面板
    var cmdGroupDefPanel = {
        id:'3',
        title:'命令组管理'
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
