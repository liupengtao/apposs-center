/**
 * Created by JetBrains RubyMine.
 * User: liupengtao.pt
 * Date: 11-7-21
 * Time: 上午11:43
 * To change this template use File | Settings | File Templates.
 */
Ext.QuickTips.init();
Ext.onReady(function() {
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
                collapsible:true,
                width:200,
                autoScroll:true,
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
                        if (nextSibling) {
                            parent.insertBefore(newNode, nextSibling);
                        } else {
                            parent.appendChild(newNode);
                        }
                    }
                }
            });

            function $(id) {
                return document.getElementById(id);
            }

            //增加命令到命令集
            function updateCmdSet(node) {
                if (node) {
                    if (node.data.allowFailure !== true) {
                        node.data.allowFailure = false;
                    }
                }
                var expression = '';
                //获取命令集表达式
                cmdSetTreePanel.getRootNode().eachChild(function(child) {
                    var data = child.data;
                    expression += data.id.substring(data.id.length - 1, data.id.length) + (data.allowFailure == true ? '|true' : '');
                    if (!child.isLast()) {
                        expression += ',';
                    }
                });
//                alert(expression)
                //更新命令集
//                Ext.Ajax.request({
//                    url:'/apps/' + appId + '/cmd_set_defs/' + cmdSetDefId,
//                    method:'PUT',
//                    params:{
//                        name:Ext.getCmp('cmdSetName').value,
//                        expression:expression
//                    },
//                    callback:function(options, success, response) {
//                        alert(success);
//                        alert(response.responseText)
//                    }
//                });
            }

            //获取命令包的相关信息
            var appId = $('app_id').value;
            var appName = $('app_name').value;
            var cmdSetDefId = $('cmd_set_def_id').value;
            var cmdSetDefName = $('cmd_set_def_name').value;
            var cmdSetDefExpression = $('cmd_set_def_expression').options;

            var cmdDefList = [];
            for (var i = 0, len = cmdSetDefExpression.length; i < len; i++) {
                var option = cmdSetDefExpression[i];
                var cmdDef = {};
                var id = option.value.split('|');
                if (id.length > 1 && id[1] == 'true') {
                    cmdDef.allowFailure = true;
                } else {
                    cmdDef.allowFailure = false;
                }
                cmdDef.id = id[0];
                cmdDef.text = option.text;
                cmdDef.leaf = true
                cmdDefList[cmdDefList.length] = cmdDef;
            }

            var cmdSetTreeStore = Ext.create('Ext.data.TreeStore', {
                root: {
                    text: cmdSetDefName,
                    expanded: true,
                    children:cmdDefList
                },
                fields:['id','text','allowFailure']
            });

            //命令包树
            var cmdSetTreePanel = Ext.create('Ext.tree.Panel', {
                title:'命令包所有命令',
                collapsible:true,
                region:'center',
                rootVisible:false,
                autoScroll:true,
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop'
                    }
                },
                store:cmdSetTreeStore,
                listeners:{
                    //向命令包中增加命令
                    iteminsert:function(parent, node, refNode) {
                        updateCmdSet(node);
                    },
                    itemappend:function(parent, node, index) {
                        updateCmdSet(node);
                    }
                },
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
                        dataIndex: 'allowFailure',
                        listeners:{
                            checkchange:function(column, number, checked) {
                                updateCmdSet();
                            }
                        }
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
                                    var nodeToDeleted = root.getChildAt(rowIndex);
                                    nodeToDeleted.remove();
                                    updateCmdSet();
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
                        layout:'anchor',
                        frame:true,
                        region:'north',
                        items:[
                            {
                                xtype:'textfield',
                                fieldLabel:'命令包名',
                                id:'cmdSetName',
                                value:cmdSetDefName,
                                anchor:'50%',
                                enableKeyEvents:true,
                                listeners:{
                                    keyup:function(text, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            updateCmdSet();
                                        }
                                    },
                                    blur:function() {
                                        updateCmdSet();
                                    }
                                }
                            }
                        ]
                    },
                    cmdSetTreePanel
                ]
            });

            var editCmdSetMainViewport = Ext.create('Ext.Viewport', {
                renderTo:document.body,
                layout: {
                    type: 'border',
                    padding: 5
                },
                defaults: {
                    split:true
                },
                items: [
                    cmdGroupTreePanel,
                    cmdSetPanel
                ]
            });
        }
    });

});
