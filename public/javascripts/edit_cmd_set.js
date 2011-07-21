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
        url:'/command_groups',
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
            alert(cmdGroupNodes)
            var cmdGroupStore = Ext.create('Ext.data.TreeStore', {
                root: {
                    text: 'Ext JS',
                    id: 'src',
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

            var cmdGroupTreePanel = Ext.create('Ext.tree.Panel', {
                title: '当前系统所有命令',
//        rootVisible: false,
                region:'center',
                store:cmdGroupStore,
                collapsible:true
            });

            var editCmdSetMainViewport = Ext.create('Ext.Viewport', {
                layout: {
                    type: 'border',
                    padding: 5
                },
                defaults: {
                    split:true
                },
                items: [
                    cmdGroupTreePanel
                ]
            });
        }
    });
});