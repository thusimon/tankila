(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{20:function(t,e,i){},29:function(t,e,i){},30:function(t,e,i){},33:function(t,e,i){},34:function(t,e,i){"use strict";i.r(e);var s=i(5),n=i(7),o=i(21),a=i.n(o),r=(i(29),i(10)),h=(i(30),Object(n.createContext)({gameData:{id:"",engine:!0},setGameData:function(){return console.warn("no data provider")}})),c=function(){return Object(n.useContext)(h)},d=i(22),u=i(11),l=i(4),v=i(14),f=i.n(v),p=i(17),w=i(0),y=i(1),b=i(8),g=i(6),m=i(2),k=i(3),j=function(){function t(e,i){Object(w.a)(this,t),this.x=void 0,this.y=void 0,this.x=e,this.y=i}return Object(y.a)(t,[{key:"add",value:function(e){return new t(this.x+e.x,this.y+e.y)}},{key:"sub",value:function(e){return new t(this.x-e.x,this.y-e.y)}},{key:"rotate",value:function(e){return new t(this.x*Math.cos(e)-this.y*Math.sin(e),this.x*Math.sin(e)+this.y*Math.cos(e))}},{key:"toString",value:function(t){return"".concat(this.x.toFixed(t),",\n").concat(this.y.toFixed(t))}}]),t}(),O=i(16),M=function(){function t(e,i,s){Object(w.a)(this,t),this.position=void 0,this.rotation=void 0,this.size=void 0,this.position=e,this.rotation=i,this.size=s}return Object(y.a)(t,[{key:"getVertexes",value:function(){var t=this.size.w/2,e=this.size.h/2;return[new j(-t,-e).rotate(this.rotation).add(this.position),new j(t,-e).rotate(this.rotation).add(this.position),new j(-t,e).rotate(this.rotation).add(this.position),new j(t,e).rotate(this.rotation).add(this.position)]}},{key:"getBound",value:function(){var t=this.getVertexes(),e=t.map((function(t){return t.y})),i=t.map((function(t){return t.x}));return{top:Math.min.apply(Math,Object(O.a)(e)),right:Math.max.apply(Math,Object(O.a)(i)),bottom:Math.max.apply(Math,Object(O.a)(e)),left:Math.min.apply(Math,Object(O.a)(i))}}}]),t}(),x=function(){function t(e,i,s,n){Object(w.a)(this,t),this.p5=void 0,this.id=void 0,this.radius=void 0,this.position=void 0,this.rotation=void 0,this.speed=void 0,this.isHit=!1,this.p5=e,this.id=i,this.radius=5,this.position=new j(s.x,s.y),this.rotation=n,this.speed=10}return Object(y.a)(t,[{key:"draw",value:function(){var t=this.p5,e=new j(this.speed*Math.cos(this.rotation),this.speed*Math.sin(this.rotation));this.position=this.position.add(e),t.circle(this.position.x,this.position.y,this.radius)}}]),t}(),S=function t(e,i){Object(w.a)(this,t),this.w=void 0,this.h=void 0,this.w=e,this.h=i},R=function(){function t(e,i){Object(w.a)(this,t),this.center=void 0,this.radius=void 0,this.center=e,this.radius=i}return Object(y.a)(t,[{key:"getBound",value:function(){return{top:this.center.y-this.radius,right:this.center.x+this.radius,bottom:this.center.y+this.radius,left:this.center.x-this.radius}}}]),t}(),z=function(t,e){var i=t.getBound(),s=e.getBound();return i.top>=s.top&&i.right<=s.right&&i.bottom<=s.bottom&&i.left>=s.left},B=function(t,e,i){return Math.abs(e.x*t.y-t.x*e.y+(i.x*e.y-e.x*i.y)+(t.x*i.y-i.x*t.y))/2},P=function(t,e){var i=e.getVertexes(),s=Object(r.a)(i,4),n=s[0],o=s[1],a=s[2],h=s[3],c=t.center,d=e.size.w*e.size.h;return B(n,o,c)+B(o,a,c)+B(a,h,c)+B(h,n,c)<=d},F=function(){function t(e,i,s,n){Object(w.a)(this,t),this.p5=void 0,this.config=void 0,this.size=void 0,this.halfSize=void 0,this.position=void 0,this.rotation=void 0,this.speedMove=void 0,this.speedRotate=void 0,this.speedBullet=void 0,this.body=void 0,this.battleField=void 0,this.id=void 0,this.bullets=void 0,this.allowFire=!0,this.debug=void 0,this.isLive=!0,this.p5=e,this.config=i,this.size={w:48,h:32},this.halfSize={w:this.size.w/2,h:this.size.h/2},n?(this.position=n.position,this.rotation=n.rotation):(this.position=new j(50,this.config.height-80),this.rotation=0),this.speedMove=2,this.speedRotate=e.PI/40,this.speedBullet=5,this.body=new M(this.position,this.rotation,this.size),this.battleField=new M(new j(i.width/2,i.height/2),0,new S(i.width,i.height)),this.id=s,this.bullets=[],this.debug=!1}return Object(y.a)(t,[{key:"draw",value:function(t){var e=this.p5;e.stroke(t),e.textSize(12),e.push(),e.fill(255,255,255),e.translate(this.position.x,this.position.y),e.rotate(this.rotation),e.rect(-this.halfSize.w,-this.halfSize.h,this.size.w,this.size.h,5),e.rect(0,-this.halfSize.h/4,this.size.w,this.halfSize.h/2),e.stroke(255,255,255),e.fill(t),this.p5.text(this.id,1-this.halfSize.w,0),e.pop(),e.fill(t),this.drawBullets(),this.debug&&(e.fill(0,0,255),this.debugInfo())}},{key:"debugInfo",value:function(){var t=this.p5;new M(this.position,this.rotation,this.size).getVertexes().forEach((function(e){t.text(e.toString(1),e.x,e.y)}))}},{key:"drawBullets",value:function(){var t=this;this.bullets.forEach((function(t){t.draw()})),this.bullets=this.bullets.filter((function(e){var i=new R(e.position,e.radius);return z(i,t.battleField)}))}},{key:"nomalizePostion",value:function(t){return new j(t.x/this.config.width,t.y/this.config.height)}},{key:"denomalizePosition",value:function(t){return new j(t.x*this.config.width,t.y*this.config.height)}}]),t}(),I=function(t){Object(m.a)(i,t);var e=Object(k.a)(i);function i(t,s,n,o,a){var r;return Object(w.a)(this,i),(r=e.call(this,t,s,n,a)).message=void 0,r.message=o,r}return Object(y.a)(i,[{key:"draw",value:function(){var t=this,e=this.p5,s=this.rotation,n=new j(this.position.x,this.position.y);e.keyIsDown(65)&&(s-=this.speedRotate,this.sendRotateLeft(!0)),e.keyIsDown(68)&&(s+=this.speedRotate,this.sendRotateRight(!0)),s%=2*e.PI;var o=0;e.keyIsDown(87)&&(o=this.speedMove,this.sendMoveForward(!0)),e.keyIsDown(83)&&(o=-this.speedMove,this.sendMoveBackword(!0));var a=new j(o*Math.cos(s),o*Math.sin(s));n=n.add(a);var r=new M(n,s,this.size);if(this.position=n,this.rotation=s,this.body=r,e.keyIsDown(32)&&this.allowFire){this.allowFire=!1;var h=new j(this.size.w*Math.cos(this.rotation),this.size.w*Math.sin(this.rotation)),c=new x(this.p5,this.id,this.position.add(h),this.rotation);this.message.sendMessage("blt,".concat(c.position.x,",").concat(c.position.y,",").concat(c.rotation)),this.bullets.push(c)}e.keyReleased=function(){32==e.keyCode&&(t.allowFire=!0),65==e.keyCode&&t.sendRotateLeft(!1),68==e.keyCode&&t.sendRotateRight(!1),87==e.keyCode&&t.sendMoveForward(!1),83==e.keyCode&&t.sendMoveBackword(!1)},Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,e.color(255,0,0))}},{key:"sendMoveForward",value:function(t){this.message.sendMessage("fwd,".concat(t?"1":"0"))}},{key:"sendMoveBackword",value:function(t){this.message.sendMessage("bwd,".concat(t?"1":"0"))}},{key:"sendRotateLeft",value:function(t){this.message.sendMessage("rl,".concat(t?"1":"0"))}},{key:"sendRotateRight",value:function(t){this.message.sendMessage("rr,".concat(t?"1":"0"))}}]),i}(F),E=function(t){Object(m.a)(i,t);var e=Object(k.a)(i);function i(t,s,n,o){var a;return Object(w.a)(this,i),(a=e.call(this,t,s,n,o)).tankCommands=void 0,a.tankCommands={fwd:!1,bwd:!1,rl:!1,rr:!1,blt:!1},a}return Object(y.a)(i,[{key:"updateCommands",value:function(t){this.tankCommands=Object(u.a)(Object(u.a)({},this.tankCommands),t)}},{key:"updateStatus",value:function(t,e){this.position=t,this.rotation=e,this.body=new M(t,e,this.size)}},{key:"draw",value:function(){var t=this.p5,e=this.tankCommands,s=this.rotation,n=new j(this.position.x,this.position.y);e.rl&&(s-=this.speedRotate),e.rr&&(s+=this.speedRotate),s%=2*t.PI;var o=0;e.fwd&&(o=this.speedMove),e.bwd&&(o=-this.speedMove);var a=new j(o*Math.cos(s),o*Math.sin(s));n=n.add(a);var r=new M(n,s,this.size);this.position=n,this.rotation=s,this.body=r,Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,t.color(0,0,255))}},{key:"addBullet",value:function(t,e,i){var s=new x(this.p5,this.id,new j(t,e),i);this.bullets.push(s)}}]),i}(F),C=function(t){Object(m.a)(i,t);var e=Object(k.a)(i);function i(t,s,n,o){var a;return Object(w.a)(this,i),(a=e.call(this,t,s,n,o)).lastMoveTime=void 0,a.minMoveTime=void 0,a.move=void 0,a.speedMove=1,a.speedRotate=t.PI/80,a.speedBullet=2.5,a.lastMoveTime=Date.now(),a.minMoveTime=3e3,a.move={forward:0,rotation:0},a}return Object(y.a)(i,[{key:"draw",value:function(){var t=this.p5;this.randomMove(),Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,t.color(0,255,255))}},{key:"randomMove",value:function(){var t=this.p5,e=Date.now();e<this.lastMoveTime+this.minMoveTime||(this.lastMoveTime=e,this.move.forward=Math.floor(10*Math.random()),this.move.rotation=Math.floor(10*Math.random()));var i=0;i=this.move.forward<=1?0:this.move.forward<=3?-this.speedMove:this.speedMove;var s=this.rotation;this.move.rotation<=1?s-=this.speedRotate:this.move.rotation<=3&&(s+=this.speedRotate),s%=2*t.PI;var n=new j(i*Math.cos(s),i*Math.sin(s)),o=new j(this.position.x,this.position.y);o=o.add(n);var a=new M(o,s,this.size);(function(t,e){var i=t.getBound(),s=e.getBound();return i.top>=s.top&&i.right<=s.right&&i.bottom<=s.bottom&&i.left>=s.left})(a,this.battleField)&&(this.position=o,this.rotation=s,this.body=a)}}]),i}(F),L=i(23),D=i.n(L),H=function(){var t=window.location,e="wss:";return"http:"===t.protocol&&(e="ws:"),e+="//"+t.host},G=function(){function t(e){Object(w.a)(this,t),this.ws=void 0,this.id=void 0,this.id=e}return Object(y.a)(t,[{key:"getConnection",value:function(){var t=Object(p.a)(f.a.mark((function t(){var e,i=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=H(),this.ws=new WebSocket("".concat(e,"/websockets?id=").concat(encodeURIComponent(this.id))),t.abrupt("return",new Promise((function(t){i.ws.addEventListener("open",(function(){t(!0)})),i.ws.addEventListener("error",(function(){t(!1)}))})));case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"listenOnMessage",value:function(t){this.ws.addEventListener("message",(function(e){t(e.data)}))}},{key:"sendMessage",value:function(t){this.ws.send(t)}}]),t}(),T=function(){function t(e){var i=this;Object(w.a)(this,t),this.config=void 0,this.p5=void 0,this.sketch=void 0,this.me=void 0,this.robots=void 0,this.players=void 0,this.canvas=void 0,this.score=void 0,this.message=void 0,this.id=void 0,this.config=e,this.robots=[],this.players={},this.id=e.id,this.score={},this.message=new G(this.id),this.p5=new D.a((function(t){t.setup=function(){i.setupGame(t)},t.draw=function(){i.runGame()}}))}return Object(y.a)(t,[{key:"setupGame",value:function(){var t=Object(p.a)(f.a.mark((function t(e){var i,s,n=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.sketch=e,(i=document.querySelector("#".concat(this.config.canvasParentId," canvas")))&&i.remove(),this.canvas=e.createCanvas(this.config.width,this.config.height),this.canvas.parent(this.config.canvasParentId),t.next=7,this.message.getConnection();case 7:t.sent&&(s=this.getRandTankStatus(),this.me=new I(this.p5,this.config,this.id,this.message,s),this.message.listenOnMessage(this.handleMessages.bind(this)),setInterval((function(){n.message.sendMessage("pos,".concat(n.me.position.x,",").concat(n.me.position.y,",").concat(n.me.rotation))}),this.config.syncRate));case 9:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"runGame",value:function(){for(var t in this.sketch.background("#F3F3F3"),this.drawScore(),this.me&&this.me.draw(),this.players){this.players[t].draw()}this.checkIfHit()}},{key:"drawScore",value:function(){var t=this,e=this.p5;e.fill(0,0,255),e.stroke(0,0,255),e.textSize(32),Object.keys(this.score).forEach((function(i,s){e.text("".concat(i,": ").concat(t.score[i]),20,40+32*s)}))}},{key:"handleMessages",value:function(t){var e=t.indexOf(","),i=t.substring(0,e),s=t.substring(e+1);switch(i){case"pos":this.updatePlayersPostion(s);break;case"fwd":case"bwd":case"rl":case"rr":this.updatePlayer(i,s);break;case"blt":this.updateBullets(s);break;case"hit":this.updateScore(s);break;case"ext":this.updateExit(s)}}},{key:"updatePlayersPostion",value:function(t){var e=JSON.parse(t);for(var i in e){var s=e[i].split(",");if(i!==this.id){var n={position:new j(+s[0],+s[1]),rotation:+s[2]},o=this.players[i];o?o.updateStatus(n.position,n.rotation):this.players[i]=new E(this.p5,this.config,i,n)}}}},{key:"updatePlayer",value:function(t,e){var i=e.split(","),s=i[0],n=+i[1];if(s!==this.id&&this.players[s]){var o=this.players[s],a=Object(l.a)({},t,!!n);o.tankCommands=Object(u.a)(Object(u.a)({},o.tankCommands),a)}}},{key:"updateScore",value:function(t){this.score=JSON.parse(t)}},{key:"updateBullets",value:function(t){var e=t.split(","),i=Object(r.a)(e,4),s=i[0],n=i[1],o=i[2],a=i[3];if(s!==this.id){var h=this.players[s];h&&h.addBullet(+n,+o,+a)}}},{key:"updateExit",value:function(t){delete this.players[t],delete this.score[t]}},{key:"addRobots",value:function(){var t=this.robots.length;this.robots.push(new C(this.p5,this.config,"robot".concat(t),this.getRandTankStatus()))}},{key:"getRandTankStatus",value:function(){return{position:new j(Math.random()*this.config.width,Math.random()*this.config.height),rotation:2*Math.random()*this.p5.PI}}},{key:"checkIfHit",value:function(){var t=Object(u.a)(Object(u.a)({},this.players),{},Object(l.a)({},this.id,this.me));for(var e in t){var i=t[e];if(i){var s,n=Object(d.a)(i.bullets);try{for(n.s();!(s=n.n()).done;){var o=s.value;if(!o.isHit){var a=new R(o.position,o.radius);for(var r in t)if(r!=e){var h=t[r];P(a,h.body)&&(console.log("tank ".concat(e," bullet hits tank ").concat(r)),e==this.id&&this.message.sendMessage("hit,".concat(this.id)),o.isHit=!0)}}}}catch(c){n.e(c)}finally{n.f()}i.bullets=i.bullets.filter((function(t){return!t.isHit}))}}}}]),t}(),W=(i(20),function(){var t=Object(n.useRef)(null),e=c().gameData;return Object(n.useEffect)((function(){var i=window.innerWidth,s=window.innerHeight,n=t.current;n&&(n.style.width="".concat(i,"px"),n.style.height="".concat(s,"px")),new T({width:i,height:s,canvasParentId:"game-container",syncRate:100,id:e.id})}),[]),Object(s.jsx)("div",{id:"game-container",ref:t})}),N=i(9),J=function(t){Object(m.a)(i,t);var e=Object(k.a)(i);function i(t,s,n,o,a){var r;return Object(w.a)(this,i),(r=e.call(this,t,s,o,a)).message=void 0,r.transformStatus=void 0,r.headDirection=void 0,r.message=n,r.transformStatus={direction:0,rotation:0},r.speedMove=80,r.speedRotate=1,r.speedBullet=500,r.bullets=[],r.debug=!1,r.headDirection=new N.h(1,0,0),r}return Object(y.a)(i,[{key:"sendMoveForward",value:function(t){this.message.sendMessage("fwd,".concat(t?"1":"0"))}},{key:"sendMoveBackword",value:function(t){this.message.sendMessage("bwd,".concat(t?"1":"0"))}},{key:"sendRotateLeft",value:function(t){this.message.sendMessage("rl,".concat(t?"1":"0"))}},{key:"sendRotateRight",value:function(t){this.message.sendMessage("rr,".concat(t?"1":"0"))}},{key:"moveForward",value:function(){this.transformStatus.direction=1}},{key:"isMovingForward",value:function(){return 1===this.transformStatus.direction}},{key:"moveBackward",value:function(){this.transformStatus.direction=-1}},{key:"isMovingBackward",value:function(){return-1===this.transformStatus.direction}},{key:"stopMoving",value:function(){this.transformStatus.direction=0}},{key:"isMovingStop",value:function(){return 0===this.transformStatus.direction}},{key:"rotateRight",value:function(){this.transformStatus.rotation=-1}},{key:"isRotatingRight",value:function(){return-1===this.transformStatus.rotation}},{key:"rotateLeft",value:function(){this.transformStatus.rotation=1}},{key:"isRotatingLeft",value:function(){return 1===this.transformStatus.rotation}},{key:"stopRotating",value:function(){this.transformStatus.rotation=0}},{key:"isRotatingStop",value:function(){return 0===this.transformStatus.rotation}},{key:"update",value:function(){var t=this.clock.getDelta(),e=this.transformStatus.rotation*this.speedRotate*t;this.body.rotateZ(e);var i=this.transformStatus.direction*this.speedMove*t,s=new N.h(1,0,0);this.body.translateOnAxis(s,i)}}]),i}(function(){function t(e,i,s,n){Object(w.a)(this,t),this.p5=void 0,this.config=void 0,this.size=void 0,this.halfSize=void 0,this.position=void 0,this.rotation=void 0,this.speedMove=void 0,this.speedRotate=void 0,this.speedBullet=void 0,this.battleField=void 0,this.id=void 0,this.bullets=void 0,this.allowFire=!0,this.debug=void 0,this.isLive=!0,this.bodyGeometry=void 0,this.bodyMaterial=void 0,this.body=void 0,this.clock=void 0,this.clock=s,this.bodyGeometry=new N.a(24,15,0),this.bodyMaterial=new N.e({color:16776960}),this.body=new N.d(this.bodyGeometry,this.bodyMaterial),e.add(this.body)}return Object(y.a)(t,[{key:"debugInfo",value:function(){var t=this.p5;new M(this.position,this.rotation,this.size).getVertexes().forEach((function(e){t.text(e.toString(1),e.x,e.y)}))}},{key:"drawBullets",value:function(){var t=this;this.bullets.forEach((function(t){t.draw()})),this.bullets=this.bullets.filter((function(e){var i=new R(e.position,e.radius);return z(i,t.battleField)}))}},{key:"nomalizePostion",value:function(t){return new j(t.x/this.config.width,t.y/this.config.height)}},{key:"denomalizePosition",value:function(t){return new j(t.x*this.config.width,t.y*this.config.height)}}]),t}()),V=function(){function t(e){Object(w.a)(this,t),this.config=void 0,this.score=void 0,this.message=void 0,this.id=void 0,this.scene=void 0,this.camera=void 0,this.renderer=void 0,this.player=void 0,this.clock=void 0,this.config=e,this.id=e.id,this.score={},this.message=new G(this.id),this.scene=new N.g,this.scene.background=new N.c(11329415),this.camera=new N.f(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=800,this.renderer=new N.i({antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),document.getElementById(e.canvasParentId).appendChild(this.renderer.domElement),this.registerEvents(),this.clock=new N.b,this.player=new J(this.scene,e,this.message,this.clock),this.animate()}return Object(y.a)(t,[{key:"animate",value:function(){requestAnimationFrame(this.animate.bind(this)),this.renderer.render(this.scene,this.camera),this.player.update()}},{key:"registerEvents",value:function(){var t=this;window.addEventListener("resize",(function(){t.camera.aspect=window.innerWidth/window.innerHeight,t.camera.updateProjectionMatrix(),t.renderer.setSize(window.innerWidth,window.innerHeight)})),window.addEventListener("keydown",this.keydownListener.bind(this)),window.addEventListener("keyup",this.keyupListener.bind(this))}},{key:"keydownListener",value:function(t){"w"===t.key&&this.player.moveForward(),"s"===t.key&&this.player.moveBackward(),"a"===t.key&&this.player.rotateLeft(),"d"===t.key&&this.player.rotateRight()}},{key:"keyupListener",value:function(t){"w"===t.key&&this.player.isMovingForward()&&this.player.stopMoving(),"s"===t.key&&this.player.isMovingBackward()&&this.player.stopMoving(),"a"===t.key&&this.player.isRotatingLeft()&&this.player.stopRotating(),"d"===t.key&&this.player.isRotatingRight()&&this.player.stopRotating()}},{key:"handleMessages",value:function(t){var e=t.indexOf(","),i=t.substring(0,e),s=t.substring(e+1);switch(i){case"pos":this.updatePlayersPostion(s);break;case"fwd":case"bwd":case"rl":case"rr":this.updatePlayer(i,s);break;case"blt":this.updateBullets(s);break;case"hit":this.updateScore(s);break;case"ext":this.updateExit(s)}}},{key:"updatePlayersPostion",value:function(t){var e=JSON.parse(t);for(var i in e){e[i].split(",");this.id}}},{key:"updatePlayer",value:function(t,e){var i=e.split(",");i[0],i[1]}},{key:"updateScore",value:function(t){this.score=JSON.parse(t)}},{key:"updateBullets",value:function(t){var e=t.split(","),i=Object(r.a)(e,4);i[0],i[1],i[2],i[3];this.id}},{key:"updateExit",value:function(t){delete this.score[t]}},{key:"addRobots",value:function(){console.log(1)}},{key:"checkIfHit",value:function(){console.log(1)}}]),t}(),A=function(){var t,e=c().gameData;return Object(n.useEffect)((function(){var i=window.innerWidth,s=window.innerHeight;t||(t=new V({width:i,height:s,canvasParentId:"game-container",syncRate:100,id:e.id}))}),[]),Object(s.jsx)("div",{id:"game-container"})},q=(i(33),function(){var t=Object(n.useRef)(null),e=Object(n.useRef)(null),i=c(),o=i.setGameData,a=i.gameData;Object(n.useEffect)((function(){e.current&&(e.current.checked=a.engine)}),[]);return Object(s.jsx)("div",{id:"tank-name-form",children:Object(s.jsxs)("form",{onSubmit:function(i){i.preventDefault();var s="",n=!0;t.current&&t.current.value&&(s=t.current.value),e.current&&(n=e.current.checked),o({id:s,engine:n})},children:[Object(s.jsx)("div",{className:"form-div",children:Object(s.jsx)("input",{id:"tank-name",size:50,placeholder:"please name your tank",ref:t})}),Object(s.jsxs)("div",{className:"form-div",children:[Object(s.jsx)("input",{id:"threejs-engine",type:"checkbox",ref:e}),Object(s.jsx)("label",{htmlFor:"threejs-engine",children:"Engine Mode"})]}),Object(s.jsx)("button",{children:"Start"})]})})});var U=function(){var t=Object(n.useState)({id:"",engine:!0}),e=Object(r.a)(t,2),i=e[0],o=e[1];return console.log(i),Object(s.jsx)(h.Provider,{value:{gameData:i,setGameData:o},children:Object(s.jsx)("div",{className:"App",children:i.id?i.engine?Object(s.jsx)(A,{}):Object(s.jsx)(W,{}):Object(s.jsx)(q,{})})})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(Object(s.jsx)(U,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[34,1,2]]]);
//# sourceMappingURL=main.fd8004e5.chunk.js.map