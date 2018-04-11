/*
    create by hao.c 2018/04/10

    desc: 游戏显示相关操作逻辑
 */

window.uiFunc = {
    uiList: [],
    cacheUIList: []
};

uiFunc.openUI = function(uiName, callBack) {
    // 缓存--
    for (var i = 0; i < uiFunc.cacheUIList.length; i++) {
        var temp = uiFunc.cacheUIList[i];
        if (temp && temp.name === uiName) {
            temp.active = true;
            temp.parent = cc.Canvas.instance.node;
            uiFunc.uiList.push(temp)
            delete uiFunc.cacheUIList[i];
            if (callBack) {
                callBack(temp);
            }
            //todo 动画--
            if (callBack) {
                callBack(temp);
            }
            return;
        }
    }
    // 非缓存--
    cc.loader.loadRes('ui/' + uiName, function(err, prefab) {
        if (err) {
            cc.error(err.message || err);
            return;
        }

        var temp = cc.instantiate(prefab);
        temp.parent = cc.Canvas.instance.node;
        uiFunc.uiList.push(temp)
        //todo 动画--
        if (callBack) {
            callBack(temp);
        }
    });
};

uiFunc.closeUI = function(uiName, callBack) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.name === uiName) {
            temp.active = false;
            temp.removeFromParent(true);
            uiFunc.cacheUIList.push(temp);
            delete uiFunc.uiList[i];
            //todo 动画--
            if (callBack) {
                callBack();
            }
            return;
        }
    }
}
