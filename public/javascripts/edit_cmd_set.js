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
    var csrf_token = $('meta[name="csrf-token"]').attr('content');
    Ext.Ajax.request({
        url:'/cmd_groups',
        callback:function(options, success, response) {
            var cmdGroups = Ext.decode(response.responseText);
            for (var i = 0; i < cmdGroups.length; i++) {
                var cmdGroupNode = {};
                var cmdGroup = cmdGroups[i];
                cmdGroupNode.id = 'cmd_group' + cmdGroup.id;
                cmdGroupNode.text = cmdGroup.name;

                //为命令组增加命令
                var cmdDefs = cmdGroup.cmd_defs;
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
                selModel:{
                    mode:'MULTI'
                },
                listeners:{
                    itemremove:function(parent, node) {
                        var nextSibling = node.nextSibling;
                        var newNode = node.createNode({
                            id:node.data.id,
                            text:node.data.text,
                            leaf:node.data.leaf
                        });
                        if (!node.isLeaf()) {
                            var childNodes = node.childNodes;
                            for (var i = 0,len = childNodes.length; i < len; i++) {
                                newNode.appendChild({
                                    id:childNodes[i].data.id,
                                    text:childNodes[i].data.text,
                                    leaf:childNodes[i].data.leaf
                                });
                            }
                        }
                        if (nextSibling) {
                            parent.insertBefore(newNode, nextSibling);
                        } else {
                            parent.appendChild(newNode);
                        }
                        if (node.isExpanded()) {
                            newNode.expand();
                        }
                        node.remove(true);
                    }
                }
            });

            cmdGroupTreePanel.getSelectionModel().on('select', function(selModel, record) {
                var nodes = selModel.getSelection();
                if (record.isLeaf() && nodes.indexOf(record.parentNode) > -1) {
                    selModel.deselect(record);
                }
                if (!record.isLeaf() && !record.isRoot()) {
                    record.eachChild(function(child) {
                        selModel.deselect(child);
                    });
                }
                if (record.isRoot()) {
                    selModel.deselect(record);
                }
            });

            function $(id) {
                return document.getElementById(id);
            }

            //增加命令到命令集
            function updateCmdSet(parent, node, refNode) {
                if (node) {
                    if (!node.isLeaf()) {
                        node.eachChild(function(child) {
                            var newChild = parent.createNode({
                                _id:child.data.id,
                                text:child.data.text,
                                leaf:child.data.leaf,
                                allowFailure:false
                            });
                            setTimeout(function() {
                                parent.insertBefore(newChild, refNode);
                            }, 10);
                        });
                        setTimeout(function() {
                            node.removeAll();
                            node.remove();
                        }, 10);

                    } else if (node.data.allowFailure !== true) {
                        if (!node.data._id) {//当增加文件夹中的所有命令时需要注意的地方。
                            node.data._id = node.data.id;
                        }
                        node.data.allowFailure = false;
                    }
                }
                setTimeout(function() {
                    var expression = '';
                    //获取命令集表达式
                    cmdSetTreePanel.getRootNode().eachChild(function(child) {
                        var id = child.get('_id');
                        expression += id.substring(id.length - 1, id.length) + (child.get('allowFailure') == true ? '|true' : '');
                        if (!child.isLast()) {
                            expression += ',';
                        }
                    });
//                alert(expression)
                    //更新命令集

                    Ext.Ajax.request({
                        url:'/apps/' + appId + '/cmd_set_defs/' + cmdSetDefId,
                        method:'PUT',
                        params:{
                            authenticity_token:csrf_token,
                            'cmd_set_def[name]':Ext.getCmp('cmdSetName').value,
                            'cmd_set_def[expression]':expression
                        },
                        callback:function(options, success, response) {
                        }
                    });
                }, 500);
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
                cmdDef._id = id[0];
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
                fields:['_id','text','allowFailure']
            });

            //命令包树
            var cmdSetTreePanel = Ext.create('Ext.tree.Panel', {
                title:'命令包所有命令',
                collapsible:true,
                region:'center',
//                rootVisible:false,
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
                        updateCmdSet(parent, node, refNode);
                    },
                    itemappend:function(parent, node, index) {
                        updateCmdSet(parent, node);
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
//                                updateCmdSet();
                                var root = this.up('treepanel').getRootNode();
                                var node = root.getChildAt(number - 1);
                                if (number == 0) {
                                    root.eachChild(function(child) {
                                        if (checked) {
                                            child.set('allowFailure', true);
                                        }
                                        else {
                                            child.set('allowFailure', false);
                                        }
                                        child.commit();
                                    });
                                    node = root;
                                }
                                node.commit();
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
                                    if (rowIndex == 0) {
                                        root.removeAll();
                                    } else {
                                        var nodeToDeleted = root.getChildAt(rowIndex - 1);
                                        nodeToDeleted.remove();
                                    }

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
