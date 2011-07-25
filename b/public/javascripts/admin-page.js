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

    addAdminMenu('userInfo', '用户信息管理', true);
    addAdminMenu('role', '角色管理', true);
    addAdminMenu('cmdDef', '命令管理', true);
    addAdminMenu('cmdGroupDef', '命令组管理', true);
    addAdminMenu('app', '应用管理', true);
    addAdminMenu('roomMachine', '机器和机房管理', true);

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

    //管理操作区
    var adminOperationPanel = Ext.create('Ext.panel.Panel', {
        title:'管理操作区',
        region:'center'
    });
    var userManagerPanel = Ext.create('Ext.panel.Panel', {
        title:'APPOSS管理系统',
        region:'center',
        frame:true,
        layout:'border',
        split:true,
        items:[
            adminMenuTreePanel,
            adminOperationPanel
        ]
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
            userManagerPanel
        ]
    });
});
