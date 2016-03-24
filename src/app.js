var SPRITE_WIDTH = 64;
var SPRITE_HEIGHT = 64;
var DEBUG_NODE_SHOW = false;
//tag
var TIME_TAG = 55;
var SCORE_TAG = 56;
var CLKP_TAG = 80;
var HBNUM_TAG = 66;
//set
//var TIMEMAX = 30;
var SUM_PAOPAO = 50;
var MIN_PAOPAO = 35;
var MAX_PAOPAO = 60;
var HB_Probability = 25;//--1/HB_Probability
var IS_FIRSTTIME = true;


var $_GET = (function(){//模拟php取值
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();


var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        if(IS_FIRSTTIME){
            IS_FIRSTTIME = false;
            this.Start();
            return;
        }
        this.getUserInfo();

        var size = cc.winSize;

        this.userName = "";
        this.finalTime = 0;
        this.tpaopao = MAX_PAOPAO;
        this.time = 0;
        this.score = 0;
        this.paopao = SUM_PAOPAO;
        this.hbnum = 0;
        this.addscore = true;

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);

        this.initPhysics();
        this.scheduleUpdate(); 

        //label
        var timeLabel = new cc.LabelTTF("Time", "Arial", 30);
        timeLabel.x = size.width*1/15;
        timeLabel.y = size.height*19/20;
        this.addChild(timeLabel,2,TIME_TAG);

        var socre = new cc.LabelTTF(this.tpaopao, "Arial", 30);
        socre.x = size.width*9/16;
        socre.y = size.height*19/20;
        this.addChild(socre,2,SCORE_TAG);

        var hbnum = new cc.LabelTTF("X 0", "Arial", 30);
        hbnum.x = size.width*13.5/15;
        hbnum.y = size.height*19/20;
        this.addChild(hbnum,2,HBNUM_TAG);

        var hbsp = new cc.Sprite("res/hb.png");
        hbsp.setScale(0.2,0.2);
        hbsp.setVisible(true);
        hbsp.setPosition(size.width*12/15,size.height*19/20);
        this.addChild(hbsp,2,233);

        return true;
    },
    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = DEBUG_NODE_SHOW;
        this.addChild(this._debugNode);
    },
    getUserInfo: function () {//获取用户信息
        member_id = $_GET['member_id'];
        var that = this;
        var xhr = cc.loader.getXMLHttpRequest();
        //set arguments with <url>?xxx=xxx&yyy=yyy
        xhr.open("POST", "http://1.teststudent.sinaapp.com/data.php");//目标地址
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                var JsonData = eval('(' + response + ')');
                cc.log(JsonData.head_img);
                size = cc.winSize;
                //add Userimg


                var shape = new cc.DrawNode();
                var green = cc.color(0, 255, 0, 255);
                shape.drawCircle(cc.p(0,0), 50, 8 , 400 , false , green);

                var clper = new cc.ClippingNode();
                clper.setPosition(size.width*3/8,size.height*19/20);
                clper.stencil = shape;
                
                sp = new cc.Sprite(JsonData.head_img);
                sp.setPosition(0,0);
                sp.setScale(0.25,0.25);

                clper.addChild(sp);
                clper.setLocalZOrder(2);

                that.addChild(clper);
                //add Username
                //that.userName = JsonData.member_name;
            }
        };
        var args = "member_id="+member_id+"&token=jitlgj3l040me3npp69jvj4r60";
        xhr.send(args);
    },
    sendResult: function () {//获取用户信息--修正Result

        var that = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", "http://1.teststudent.sinaapp.com/data.php");//目标地址
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                var JsonData = eval('(' + response + ')');
                cc.log(JsonData.head_img);
                size = cc.winSize;
                //add Userimg


                var shape = new cc.DrawNode();
                var green = cc.color(0, 255, 0, 255);
                shape.drawCircle(cc.p(0,0), 50, 8 , 400 , false , green);

                var clper = new cc.ClippingNode();
                clper.setPosition(size.width*3/8,size.height*19/20);
                clper.stencil = shape;
                
                sp = new cc.Sprite(JsonData.head_img);
                sp.setPosition(0,0);
                sp.setScale(0.25,0.25);

                clper.addChild(sp);
                clper.setLocalZOrder(2);

                that.addChild(clper);
                //add Username
                //that.userName = JsonData.member_name;
            }
        };
        var args = "member_id="+member_id+"&token=jitlgj3l040me3npp69jvj4r60";
        xhr.send(args);
    },
    onEnter: function () {  
        this._super();  
        cc.log("onEnter");  
        cc.eventManager.addListener({  
            event: cc.EventListener.TOUCH_ONE_BY_ONE,  
            onTouchBegan: this.onTouchBegan  
        }, this);  
    },  
    onExit: function () {  
        this._super();  
        cc.log("onExit");  
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);  
    },
    initPhysics: function () {//初始化物理引擎  
  
  
       var winSize = cc.director.getWinSize();  
  
  
       //this.space = new cp.Space(); 
       this.setupDebugNode(); 
  
  
       // 设置重力
        var tLayer = this;
       this.space = new cp.Space();
       this.space.gravity = cp.v(0, -600);
       var staticBody = this.space.staticBody;

       // 设置重力感应
       if( 'accelerometer' in cc.sys.capabilities ) {
            var self = 0;
            // call is called 30 times per second
            cc.inputManager.setAccelerometerInterval(1/30);
            cc.inputManager.setAccelerometerEnabled(true);
            cc.eventManager.addListener({
                event: cc.EventListener.ACCELERATION,
                callback: function(acc, event){
                    var target = event.getCurrentTarget();
                    if(false){//DEBUG
                        if(self == 50){
                            self = 0;
                            cc.log("X:"+acc.x+"|Y:"+acc.y+"|Z:"+acc.z);
                        }
                        self++;
                    }
                    tLayer.space.gravity = cp.v(acc.x*300,acc.y*300);
                    
                }
            }, this);

        } else {
            cc.log("ACCELEROMETER not supported");
        }

       // 设置空间边界  
       var walls = [ new cp.SegmentShape(staticBody, cp.v(0, 0),   
                                        cp.v(winSize.width, 0), 0),
           new cp.SegmentShape(staticBody, cp.v(0, winSize.height),   
                                        cp.v(winSize.width, winSize.height), 0), 
           new cp.SegmentShape(staticBody, cp.v(0, 0),   
                                        cp.v(0, winSize.height), 0), 
           new cp.SegmentShape(staticBody, cp.v(winSize.width, 0),   
                                        cp.v(winSize.width, winSize.height), 0)  
       ];  
       for (var i = 0; i < walls.length; i++) {  
           var shape = walls[i];  
           shape.setElasticity(1); 
           shape.setFriction(1); 
           this.space.addStaticShape(shape);
       }
       for(y = 0;y<SUM_PAOPAO;y++){
            this.addNewSpriteAtPosition(cc.p(Math.floor(Math.random()*cc.winSize.width)+1,Math.floor(Math.random()*cc.winSize.height)+1),Math.floor(Math.random()*15)+1,y);
       }
   },
   addNewSpriteAtPosition: function (p,x,tag) {  //添加小球
     cc.log("addNewSpriteAtPosition");  
     cc.log(x);
     if(x%3==0) x-=Math.floor(Math.random()*2)+1;


     a = [60,40,20];
     radius = a[(x-1)%3];
     var body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.v(0, 0)));
     body.setPos(p);   
     this.space.addBody(body); 

     var shape = new cp.CircleShape(body, radius, cp.v(0, 0)); 
     shape.setElasticity(0.5);  
     shape.setFriction(0.5);  
     this.space.addShape(shape);
  
  
     //创建物理引擎精灵对象 
     var pngName = "res/paopao"+x+"_1.png"; 
     var sprite = new cc.PhysicsSprite(pngName);
     sprite.setTag(tag);
     sprite.setBody(body);  
     sprite.setPosition(cc.p(p.x, p.y));
     sprite.setName(x); 
     sprite.setLocalZOrder(1);


    //  设置点击事件
     var listener1 = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,                        // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
        onTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件处理回调函数
            var target = event.getCurrentTarget();    // 获取事件所绑定的 target, 通常是cc.Node及其子类 
            tLayer = target.getParent();

            // 获取当前触摸点相对于按钮所在的坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());    
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);

            if (cc.rectContainsPoint(rect, locationInNode)) {        // 判断触摸点是否在按钮范围内
                cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                //target.opacity = 180;

                tLayer.tpaopao-=1;
                cc.eventManager.removeListener(this);
                if(tLayer.addscore){
                    tLayer.paopao -= 1;
                    /*if((target.getName()-1)%3==1) tLayer.score+=150;
                    else tLayer.score +=100;*/
                    var label3 = tLayer.getChildByTag(SCORE_TAG);
                    label3.setString(tLayer.tpaopao);
                }

                cc.audioEngine.playEffect(res.poke_wav);
                //target._texture.url
                var animation = cc.Animation.create();
                var str = "";
                for (var i = 2; i < 10; i++) {
                    str = "res/paopao" + target.getName() + "_" + i + ".png";
                    animation.addSpriteFrameWithFile(str);
                }
                animation.setDelayPerUnit(0.03);
                var action = cc.sequence(cc.animate(animation),cc.callFunc(tLayer.removePaoPao, target, true));

                if(Math.floor(Math.random()*HB_Probability)+1==HB_Probability){
                    cc.audioEngine.playEffect(res.hb_wav);
                    sp = new cc.Sprite("res/hb.png");
                    if(radius == 60){
                        sp.setScale(0.2,0.2);
                    }
                    else {
                        sp.setScale(0.15,0.15);
                    }
                    sp.setPosition(target.getPosition());
                    tLayer.addChild(sp);
                    mvac = cc.moveTo(0.5,tLayer.getChildByTag(233).getPosition());
                    var ac = cc.sequence(mvac,cc.callFunc(tLayer.removehb, sp, true));
                    sp.runAction(mvac);

                    if(tLayer.addscore){
                        tLayer.hbnum +=1;
                        var label2 = tLayer.getChildByTag(HBNUM_TAG);
                        label2.setString("X "+tLayer.hbnum);
                    }
                }

                target.runAction(action);

                
                return true;
            }
            return false;
        }
    });
    cc.eventManager.addListener(listener1, sprite);                                       
    this.addChild(sprite);                                               
    },
    removePaoPao: function(target){
        tLayer.space.removeBody(target.getBody());
        tLayer.space.removeShape(target.getBody().shapeList[0]);
        target.removeFromParent(true);
    },
    removehb: function(sp){
        sp.removeFromParent(true);
    },
    update: function (dt) {  
        var timeStep = 0.05;
        this.space.step(timeStep);
        this.time += dt;
        if(this.tpaopao == 0) {
            this.gameOver();
        }
        var label2 = this.getChildByTag(TIME_TAG);
        var string2 = this.time.toFixed(2);
        label2.setString(string2);
        if(this.paopao<MIN_PAOPAO&&this.tpaopao!=this.paopao){
            this.addNewSpriteAtPosition(cc.p(Math.floor(Math.random()*cc.winSize.width)+1,cc.winSize.height*9/10),Math.floor(Math.random()*15)+1,9);
            this.paopao+=1;
        } 
    },
    gameOver: function(){
        this.finalTime = this.time.toFixed(2);
        this.addscore = false;
        var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
        var size = cc.winSize;
        var self = this;
        var titleLabel = new cc.LabelTTF(this.getChildByTag(TIME_TAG).getString(), "Arial", 100);
        titleLabel.attr({
            x:size.width / 2 ,
            y:size.height / 2 + 100
        });
        gameOver.addChild(titleLabel, 5);
        this.unscheduleAllCallbacks();
        var TryAgainItem = new cc.MenuItemFont(
                "再来一次！",
                function () {
                    cc.log("Menu is clicked!");
                    self.removeFromParent(true);

                    var transition= cc.TransitionFade.create(1, new HelloWorldScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
        TryAgainItem.fontSize = 50;
        TryAgainItem.attr({
            x: size.width/2,
            y: size.height / 2 - 100,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(TryAgainItem);
        menu.x = 0;
        menu.y = 0;
        gameOver.addChild(menu, 1);
        this.getParent().addChild(gameOver);
    },
    Start: function(){
        this.addscore = false;
        var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
        var size = cc.winSize;
        var self = this;
        this.unscheduleAllCallbacks();
        var TryAgainItem = new cc.MenuItemFont(
                "Start!",
                function () {
                    cc.log("Menu is clicked!");
                    self.removeFromParent(true);

                    var transition= cc.TransitionFade.create(1, new HelloWorldScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
        TryAgainItem.fontSize = 50;
        TryAgainItem.attr({
            x: size.width/2,
            y: size.height / 2 - 100,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(TryAgainItem);
        menu.x = 0;
        menu.y = 0;
        gameOver.addChild(menu, 1);
        this.addChild(gameOver);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

