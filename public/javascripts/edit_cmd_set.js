/**
 * Created by JetBrains RubyMine.
 * User: liupengtao.pt
 * Date: 11-7-21
 * Time: 上午11:43
 * To change this template use File | Settings | File Templates.
 */
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
                        property: 'text',
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
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        allowParentInserts:true
                    }
                },
                listeners:{
                    beforeitemmove:function() {
//                        cmdGroupStore.reload();
                    }
                }
            });

            for (var p in cmdGroupTreePanel.dragZone) {
                alert(p + ':' + cmdGroupTreePanel.dragZone[p])
            }

            function $(id) {
                return document.getElementById(id);
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
                cmdDef.id = option.value;
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
                folderSort: true,
                sorters: [
                    {
                        property: 'text',
                        direction: 'ASC'
                    }
                ]
            });

            //命令包树
            var cmdSetTreePanel = Ext.create('Ext.tree.Panel', {
                title:'命令包',
                region:'center',
                collapsible:true,
                viewConfig: {
                    plugins: {
                        ptype: 'treeviewdragdrop',
                        allowParentInserts:true
                    }
                },
                store:cmdSetTreeStore,
                listeners:{
                    itemclick:function(view, record, item, index, e) {
                        var root = cmdSetTreePanel.getRootNode();
                        alert(root.firstChild.isFirst)
                        alert(root.findChild('id',[1]).raw.text)
                    }
                }
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
                    cmdSetTreePanel
                ]
            });
        }
    });

});
