(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{28:function(t,e,i){},29:function(t,e,i){},32:function(t,e,i){},33:function(t,e,i){},35:function(t,e,i){},36:function(t,e,i){"use strict";i.r(e);var s=i(6),o=i(9),n=i.n(o),a=i(16),r=i.n(a),h=(i(28),i(11)),c=(i(29),Object(o.createContext)({gameData:{id:"",engine:!0},setGameData:function(){return console.warn("no data provider")}})),d=function(){return Object(o.useContext)(c)},u=i(21),l=i(12),v=i(5),p=i(10),f=i.n(p),y=i(15),m=i(0),w=i(1),b=i(8),g=i(7),k=i(2),j=i(3),x=function(){function t(e,i){Object(m.a)(this,t),this.x=void 0,this.y=void 0,this.x=e,this.y=i}return Object(w.a)(t,[{key:"add",value:function(e){return new t(this.x+e.x,this.y+e.y)}},{key:"sub",value:function(e){return new t(this.x-e.x,this.y-e.y)}},{key:"rotate",value:function(e){return new t(this.x*Math.cos(e)-this.y*Math.sin(e),this.x*Math.sin(e)+this.y*Math.cos(e))}},{key:"toString",value:function(t){return"".concat(this.x.toFixed(t),",\n").concat(this.y.toFixed(t))}}]),t}(),O=i(18),M=function(){function t(e,i,s){Object(m.a)(this,t),this.position=void 0,this.rotation=void 0,this.size=void 0,this.position=e,this.rotation=i,this.size=s}return Object(w.a)(t,[{key:"getVertexes",value:function(){var t=this.size.w/2,e=this.size.h/2;return[new x(-t,-e).rotate(this.rotation).add(this.position),new x(t,-e).rotate(this.rotation).add(this.position),new x(-t,e).rotate(this.rotation).add(this.position),new x(t,e).rotate(this.rotation).add(this.position)]}},{key:"getBound",value:function(){var t=this.getVertexes(),e=t.map((function(t){return t.y})),i=t.map((function(t){return t.x}));return{top:Math.min.apply(Math,Object(O.a)(e)),right:Math.max.apply(Math,Object(O.a)(i)),bottom:Math.max.apply(Math,Object(O.a)(e)),left:Math.min.apply(Math,Object(O.a)(i))}}}]),t}(),S=function(){function t(e,i,s,o){Object(m.a)(this,t),this.p5=void 0,this.id=void 0,this.radius=void 0,this.position=void 0,this.rotation=void 0,this.speed=void 0,this.isHit=!1,this.p5=e,this.id=i,this.radius=5,this.position=new x(s.x,s.y),this.rotation=o,this.speed=10}return Object(w.a)(t,[{key:"draw",value:function(){var t=this.p5,e=new x(this.speed*Math.cos(this.rotation),this.speed*Math.sin(this.rotation));this.position=this.position.add(e),t.circle(this.position.x,this.position.y,this.radius)}}]),t}(),B=function t(e,i){Object(m.a)(this,t),this.w=void 0,this.h=void 0,this.w=e,this.h=i},R=function(){function t(e,i){Object(m.a)(this,t),this.center=void 0,this.radius=void 0,this.center=e,this.radius=i}return Object(w.a)(t,[{key:"getBound",value:function(){return{top:this.center.y-this.radius,right:this.center.x+this.radius,bottom:this.center.y+this.radius,left:this.center.x-this.radius}}}]),t}(),z=function(t,e,i){return Math.abs(e.x*t.y-t.x*e.y+(i.x*e.y-e.x*i.y)+(t.x*i.y-i.x*t.y))/2},C=function(t,e){var i=e.getVertexes(),s=Object(h.a)(i,4),o=s[0],n=s[1],a=s[2],r=s[3],c=t.center,d=e.size.w*e.size.h;return z(o,n,c)+z(n,a,c)+z(a,r,c)+z(r,o,c)<=d},P=function(){function t(e,i,s,o){Object(m.a)(this,t),this.p5=void 0,this.config=void 0,this.size=void 0,this.halfSize=void 0,this.position=void 0,this.rotation=void 0,this.speedMove=void 0,this.speedRotate=void 0,this.speedBullet=void 0,this.body=void 0,this.battleField=void 0,this.id=void 0,this.bullets=void 0,this.allowFire=!0,this.debug=void 0,this.isLive=!0,this.p5=e,this.config=i,this.size={w:48,h:32},this.halfSize={w:this.size.w/2,h:this.size.h/2},o?(this.position=o.position,this.rotation=o.rotation):(this.position=new x(50,this.config.height-80),this.rotation=0),this.speedMove=2,this.speedRotate=e.PI/40,this.speedBullet=5,this.body=new M(this.position,this.rotation,this.size),this.battleField=new M(new x(i.width/2,i.height/2),0,new B(i.width,i.height)),this.id=s,this.bullets=[],this.debug=!1}return Object(w.a)(t,[{key:"draw",value:function(t){var e=this.p5;e.stroke(t),e.textSize(12),e.push(),e.fill(255,255,255),e.translate(this.position.x,this.position.y),e.rotate(this.rotation),e.rect(-this.halfSize.w,-this.halfSize.h,this.size.w,this.size.h,5),e.rect(0,-this.halfSize.h/4,this.size.w,this.halfSize.h/2),e.stroke(255,255,255),e.fill(t),this.p5.text(this.id,1-this.halfSize.w,0),e.pop(),e.fill(t),this.drawBullets(),this.debug&&(e.fill(0,0,255),this.debugInfo())}},{key:"debugInfo",value:function(){var t=this.p5;new M(this.position,this.rotation,this.size).getVertexes().forEach((function(e){t.text(e.toString(1),e.x,e.y)}))}},{key:"drawBullets",value:function(){var t=this;this.bullets.forEach((function(t){t.draw()})),this.bullets=this.bullets.filter((function(e){return function(t,e){var i=t.getBound(),s=e.getBound();return i.top>=s.top&&i.right<=s.right&&i.bottom<=s.bottom&&i.left>=s.left}(new R(e.position,e.radius),t.battleField)}))}},{key:"nomalizePostion",value:function(t){return new x(t.x/this.config.width,t.y/this.config.height)}},{key:"denomalizePosition",value:function(t){return new x(t.x*this.config.width,t.y*this.config.height)}}]),t}(),I=function(t){Object(k.a)(i,t);var e=Object(j.a)(i);function i(t,s,o,n,a){var r;return Object(m.a)(this,i),(r=e.call(this,t,s,o,a)).message=void 0,r.message=n,r}return Object(w.a)(i,[{key:"draw",value:function(){var t=this,e=this.p5,s=this.rotation,o=new x(this.position.x,this.position.y);e.keyIsDown(65)&&(s-=this.speedRotate,this.sendRotateLeft(!0)),e.keyIsDown(68)&&(s+=this.speedRotate,this.sendRotateRight(!0)),s%=2*e.PI;var n=0;e.keyIsDown(87)&&(n=this.speedMove,this.sendMoveForward(!0)),e.keyIsDown(83)&&(n=-this.speedMove,this.sendMoveBackword(!0));var a=new x(n*Math.cos(s),n*Math.sin(s));o=o.add(a);var r=new M(o,s,this.size);if(this.position=o,this.rotation=s,this.body=r,e.keyIsDown(32)&&this.allowFire){this.allowFire=!1;var h=new x(this.size.w*Math.cos(this.rotation),this.size.w*Math.sin(this.rotation)),c=new S(this.p5,this.id,this.position.add(h),this.rotation);this.message.sendMessage("blt,".concat(c.position.x,",").concat(c.position.y,",").concat(c.rotation)),this.bullets.push(c)}e.keyReleased=function(){32==e.keyCode&&(t.allowFire=!0),65==e.keyCode&&t.sendRotateLeft(!1),68==e.keyCode&&t.sendRotateRight(!1),87==e.keyCode&&t.sendMoveForward(!1),83==e.keyCode&&t.sendMoveBackword(!1)},Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,e.color(255,0,0))}},{key:"sendMoveForward",value:function(t){this.message.sendMessage("fwd,".concat(t?"1":"0"))}},{key:"sendMoveBackword",value:function(t){this.message.sendMessage("bwd,".concat(t?"1":"0"))}},{key:"sendRotateLeft",value:function(t){this.message.sendMessage("rl,".concat(t?"1":"0"))}},{key:"sendRotateRight",value:function(t){this.message.sendMessage("rr,".concat(t?"1":"0"))}}]),i}(P),D=function(t){Object(k.a)(i,t);var e=Object(j.a)(i);function i(t,s,o,n){var a;return Object(m.a)(this,i),(a=e.call(this,t,s,o,n)).tankCommands=void 0,a.tankCommands={fwd:!1,bwd:!1,rl:!1,rr:!1,blt:!1},a}return Object(w.a)(i,[{key:"updateCommands",value:function(t){this.tankCommands=Object(l.a)(Object(l.a)({},this.tankCommands),t)}},{key:"updateStatus",value:function(t,e){this.position=t,this.rotation=e,this.body=new M(t,e,this.size)}},{key:"draw",value:function(){var t=this.p5,e=this.tankCommands,s=this.rotation,o=new x(this.position.x,this.position.y);e.rl&&(s-=this.speedRotate),e.rr&&(s+=this.speedRotate),s%=2*t.PI;var n=0;e.fwd&&(n=this.speedMove),e.bwd&&(n=-this.speedMove);var a=new x(n*Math.cos(s),n*Math.sin(s));o=o.add(a);var r=new M(o,s,this.size);this.position=o,this.rotation=s,this.body=r,Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,t.color(0,0,255))}},{key:"addBullet",value:function(t,e,i){var s=new S(this.p5,this.id,new x(t,e),i);this.bullets.push(s)}}]),i}(P),E=function(t){Object(k.a)(i,t);var e=Object(j.a)(i);function i(t,s,o,n){var a;return Object(m.a)(this,i),(a=e.call(this,t,s,o,n)).lastMoveTime=void 0,a.minMoveTime=void 0,a.move=void 0,a.speedMove=1,a.speedRotate=t.PI/80,a.speedBullet=2.5,a.lastMoveTime=Date.now(),a.minMoveTime=3e3,a.move={forward:0,rotation:0},a}return Object(w.a)(i,[{key:"draw",value:function(){var t=this.p5;this.randomMove(),Object(b.a)(Object(g.a)(i.prototype),"draw",this).call(this,t.color(0,255,255))}},{key:"randomMove",value:function(){var t=this.p5,e=Date.now();e<this.lastMoveTime+this.minMoveTime||(this.lastMoveTime=e,this.move.forward=Math.floor(10*Math.random()),this.move.rotation=Math.floor(10*Math.random()));var i=0;i=this.move.forward<=1?0:this.move.forward<=3?-this.speedMove:this.speedMove;var s=this.rotation;this.move.rotation<=1?s-=this.speedRotate:this.move.rotation<=3&&(s+=this.speedRotate),s%=2*t.PI;var o=new x(i*Math.cos(s),i*Math.sin(s)),n=new x(this.position.x,this.position.y);n=n.add(o);var a=new M(n,s,this.size);(function(t,e){var i=t.getBound(),s=e.getBound();return i.top>=s.top&&i.right<=s.right&&i.bottom<=s.bottom&&i.left>=s.left})(a,this.battleField)&&(this.position=n,this.rotation=s,this.body=a)}}]),i}(P),F=i(22),G=i.n(F),L=function(){var t=window.location,e="wss:";return"http:"===t.protocol&&(e="ws:"),e+="//"+t.host},T=function(){function t(e){Object(m.a)(this,t),this.ws=void 0,this.id=void 0,this.id=e}return Object(w.a)(t,[{key:"getConnection",value:function(){var t=Object(y.a)(f.a.mark((function t(){var e,i=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=L(),this.ws=new WebSocket("".concat(e,"/websockets?id=").concat(encodeURIComponent(this.id))),t.abrupt("return",new Promise((function(t){i.ws.addEventListener("open",(function(){t(!0)})),i.ws.addEventListener("error",(function(){t(!1)}))})));case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"listenOnMessage",value:function(t){this.ws.addEventListener("message",(function(e){t(e.data)}))}},{key:"sendMessage",value:function(t){this.ws.send(t)}}]),t}(),H=function(){function t(e){var i=this;Object(m.a)(this,t),this.config=void 0,this.p5=void 0,this.sketch=void 0,this.me=void 0,this.robots=void 0,this.players=void 0,this.canvas=void 0,this.score=void 0,this.message=void 0,this.id=void 0,this.config=e,this.robots=[],this.players={},this.id=e.id,this.score={},this.message=new T(this.id),this.p5=new G.a((function(t){t.setup=function(){i.setupGame(t)},t.draw=function(){i.runGame()}}))}return Object(w.a)(t,[{key:"setupGame",value:function(){var t=Object(y.a)(f.a.mark((function t(e){var i,s,o=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.sketch=e,(i=document.querySelector("#".concat(this.config.canvasParentId," canvas")))&&i.remove(),this.canvas=e.createCanvas(this.config.width,this.config.height),this.canvas.parent(this.config.canvasParentId),t.next=7,this.message.getConnection();case 7:t.sent&&(s=this.getRandTankStatus(),this.me=new I(this.p5,this.config,this.id,this.message,s),this.message.listenOnMessage(this.handleMessages.bind(this)),setInterval((function(){o.message.sendMessage("pos,".concat(o.me.position.x,",").concat(o.me.position.y,",").concat(o.me.rotation))}),this.config.syncRate));case 9:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"runGame",value:function(){for(var t in this.sketch.background("#F3F3F3"),this.drawScore(),this.me&&this.me.draw(),this.players){this.players[t].draw()}this.checkIfHit()}},{key:"drawScore",value:function(){var t=this,e=this.p5;e.fill(0,0,255),e.stroke(0,0,255),e.textSize(32),Object.keys(this.score).forEach((function(i,s){e.text("".concat(i,": ").concat(t.score[i]),20,40+32*s)}))}},{key:"handleMessages",value:function(t){var e=t.indexOf(","),i=t.substring(0,e),s=t.substring(e+1);switch(i){case"pos":this.updatePlayersPostion(s);break;case"fwd":case"bwd":case"rl":case"rr":this.updatePlayer(i,s);break;case"blt":this.updateBullets(s);break;case"hit":this.updateScore(s);break;case"ext":this.updateExit(s)}}},{key:"updatePlayersPostion",value:function(t){var e=JSON.parse(t);for(var i in e){var s=e[i].split(",");if(i!==this.id){var o={position:new x(+s[0],+s[1]),rotation:+s[2]},n=this.players[i];n?n.updateStatus(o.position,o.rotation):this.players[i]=new D(this.p5,this.config,i,o)}}}},{key:"updatePlayer",value:function(t,e){var i=e.split(","),s=i[0],o=+i[1];if(s!==this.id&&this.players[s]){var n=this.players[s],a=Object(v.a)({},t,!!o);n.tankCommands=Object(l.a)(Object(l.a)({},n.tankCommands),a)}}},{key:"updateScore",value:function(t){this.score=JSON.parse(t)}},{key:"updateBullets",value:function(t){var e=t.split(","),i=Object(h.a)(e,4),s=i[0],o=i[1],n=i[2],a=i[3];if(s!==this.id){var r=this.players[s];r&&r.addBullet(+o,+n,+a)}}},{key:"updateExit",value:function(t){delete this.players[t],delete this.score[t]}},{key:"addRobots",value:function(){var t=this.robots.length;this.robots.push(new E(this.p5,this.config,"robot".concat(t),this.getRandTankStatus()))}},{key:"getRandTankStatus",value:function(){return{position:new x(Math.random()*this.config.width,Math.random()*this.config.height),rotation:2*Math.random()*this.p5.PI}}},{key:"checkIfHit",value:function(){var t=Object(l.a)(Object(l.a)({},this.players),{},Object(v.a)({},this.id,this.me));for(var e in t){var i=t[e];if(i){var s,o=Object(u.a)(i.bullets);try{for(o.s();!(s=o.n()).done;){var n=s.value;if(!n.isHit){var a=new R(n.position,n.radius);for(var r in t)if(r!=e){var h=t[r];C(a,h.body)&&(console.log("tank ".concat(e," bullet hits tank ").concat(r)),e==this.id&&this.message.sendMessage("hit,".concat(this.id)),n.isHit=!0)}}}}catch(c){o.e(c)}finally{o.f()}i.bullets=i.bullets.filter((function(t){return!t.isHit}))}}}}]),t}(),W=(i(32),function(){var t=Object(o.useRef)(null),e=d().gameData;return Object(o.useEffect)((function(){var i=window.innerWidth,s=window.innerHeight,o=t.current;o&&(o.style.width="".concat(i,"px"),o.style.height="".concat(s,"px")),new H({width:i,height:s,canvasParentId:"game-container",syncRate:100,id:e.id})}),[]),Object(s.jsx)("div",{id:"game-container",ref:t})}),A=(i(33),i(4)),N=function(t){var e=t.scores,i=t.id;return Object(s.jsx)("div",{id:"score-info",children:e.map((function(t){var e=t.id===i?"me":"player";return Object(s.jsxs)("p",{className:e,children:[t.id,": ",t.score]},t.id)}))})},J=function(){function t(e,i,s,o,n,a,r){Object(m.a)(this,t),this.id=void 0,this.radius=void 0,this.position=void 0,this.rotation=void 0,this.speed=void 0,this.isHit=!1,this.material=void 0,this.geo=void 0,this.mesh=void 0,this.scene=void 0,this.idx=void 0,this.scene=e,this.radius=.5,this.speed=n,this.id=i,this.position=s.clone(),this.rotation=o.clone(),this.idx=a,this.material=new A.j({color:r}),this.geo=new A.n(this.radius,8,8),this.mesh=new A.i(this.geo,this.material),this.mesh.position.set(this.position.x,this.position.y,this.position.z),this.mesh.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z),this.scene.add(this.mesh)}return Object(w.a)(t,[{key:"collisionWithMeshes",value:function(t){var e=this.mesh.position.clone(),i=new A.r(0,0,-1),s=new A.l(e,i).intersectObjects(t);return s.length>0&&s[0].distance<i.length()&&(console.log("hit the mesh!"),!0)}},{key:"destory",value:function(){this.geo.dispose(),this.material.dispose(),this.scene.remove(this.mesh)}}]),t}(),V=function(){function t(e,i,s){Object(m.a)(this,t),this.speedMove=void 0,this.speedRotate=void 0,this.speedBullet=void 0,this.id=void 0,this.bullets=void 0,this.allowShoot=!0,this.debug=void 0,this.isLive=!0,this.bodyGeometry=void 0,this.towerGeometry=void 0,this.cannonGeometry=void 0,this.material=void 0,this.mesh=void 0,this.scene=void 0,this.color=void 0,this.bltColor=void 0,this.transformStatus=void 0,this.boundary=void 0,this.score=void 0,this.texture=void 0,this.spriteMaterial=void 0,this.textSprite=void 0,this.scene=e,this.id=i,this.score=0,this.color=s.color,this.bltColor=s.bltColor,this.bullets={},this.transformStatus={direction:0,rotation:0},this.boundary=new A.r(0,0,0),this.material=new A.j({color:this.color}),this.bodyGeometry=new A.b(8,6,1.2),this.towerGeometry=new A.e(2,2,1,16),this.towerGeometry.rotateX(Math.PI/2),this.towerGeometry.translate(0,0,1.1),this.cannonGeometry=new A.e(.5,.25,8,16),this.cannonGeometry.rotateZ(Math.PI/2),this.cannonGeometry.translate(5,0,1.1),this.bodyGeometry.merge(this.towerGeometry),this.bodyGeometry.merge(this.cannonGeometry),this.mesh=new A.i(this.bodyGeometry,this.material),this.scene.add(this.mesh),this.makeTextSprite(this.id),this.scene.add(this.textSprite)}return Object(w.a)(t,[{key:"updateTextSprite",value:function(){if(this.textSprite){var t=this.mesh.position;this.textSprite.position.set(t.x,t.y+10,t.z+2),this.textSprite.scale.set(10,5,1)}}},{key:"isMovingForward",value:function(){return 1===this.transformStatus.direction}},{key:"moveForward",value:function(){this.transformStatus.direction=1}},{key:"isMovingBackward",value:function(){return-1===this.transformStatus.direction}},{key:"moveBackward",value:function(){this.transformStatus.direction=-1}},{key:"stopMoving",value:function(){this.transformStatus.direction=0}},{key:"isMovingStop",value:function(){return 0===this.transformStatus.direction}},{key:"rotateRight",value:function(){this.transformStatus.rotation=-1}},{key:"isRotatingRight",value:function(){return-1===this.transformStatus.rotation}},{key:"rotateLeft",value:function(){this.transformStatus.rotation=1}},{key:"isRotatingLeft",value:function(){return 1===this.transformStatus.rotation}},{key:"stopRotating",value:function(){this.transformStatus.rotation=0}},{key:"isRotatingStop",value:function(){return 0===this.transformStatus.rotation}},{key:"updatePosByServer",value:function(t,e,i){this.mesh.rotation.z=i,this.mesh.position.x=t,this.mesh.position.y=e,this.updateTextSprite()}},{key:"updateBulletsByServer",value:function(t,e){var i=this;t.forEach((function(t){var s=i.bullets[t.idx];if(s)t.hit?(s.destory(),delete i.bullets[t.idx],console.log("Tank ".concat(e,"'s bullet ").concat(t.idx," destoried"))):s.mesh.position.set(t.pos.x,t.pos.y,t.pos.z);else{var o=new A.r(t.pos.x,t.pos.y,t.pos.z),n=new A.g(0,0,t.rot),a=new J(i.scene,i.id,o,n,i.speedBullet,t.idx,i.bltColor);i.bullets[t.idx]=a}}))}},{key:"destory",value:function(){for(var t in this.bodyGeometry.dispose(),this.towerGeometry.dispose(),this.cannonGeometry.dispose(),this.material.dispose(),this.scene.remove(this.mesh),this.bullets)this.bullets[t].destory();this.texture.dispose(),this.spriteMaterial.dispose(),this.scene.remove(this.textSprite)}},{key:"makeTextSprite",value:function(t){var e=255,i=255,s=255,o=0,n=document.createElement("canvas"),a=n.getContext("2d");return a.font="bold ".concat(96,"px ").concat("Arial"),a.textAlign="center",a.fillStyle="rgba(".concat(e,",").concat(i,",").concat(s,",").concat(o,")"),a.lineWidth=2,a.fillStyle="rgba(25,25,25,1.0)",a.fillText(t,2,98),this.texture=new A.q(n),this.texture.needsUpdate=!0,this.spriteMaterial=new A.p({map:this.texture,color:this.color}),this.textSprite=new A.o(this.spriteMaterial),this.textSprite}}]),t}(),q=function(t){Object(k.a)(i,t);var e=Object(j.a)(i);function i(t,s,o,n,a){var r;return Object(m.a)(this,i),(r=e.call(this,t,s,a)).message=void 0,r.headDirection=void 0,r.message=o,r.boundary=n,r.speedMove=20,r.speedRotate=1,r.speedBullet=80,r.debug=!1,r.headDirection=new A.r(1,0,0),r}return Object(w.a)(i,[{key:"moveForward",value:function(){1!=this.transformStatus.direction&&this.message.sendMessage("dir,1,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"moveForward",this).call(this)}},{key:"moveBackward",value:function(){-1!=this.transformStatus.direction&&this.message.sendMessage("dir,-1,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"moveBackward",this).call(this)}},{key:"stopMoving",value:function(){0!=this.transformStatus.direction&&this.message.sendMessage("dir,0,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"stopMoving",this).call(this)}},{key:"rotateRight",value:function(){-1!=this.transformStatus.rotation&&this.message.sendMessage("rot,-1,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"rotateRight",this).call(this)}},{key:"rotateLeft",value:function(){1!=this.transformStatus.rotation&&this.message.sendMessage("rot,1,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"rotateLeft",this).call(this)}},{key:"stopRotating",value:function(){0!=this.transformStatus.rotation&&this.message.sendMessage("rot,0,".concat(Date.now())),Object(b.a)(Object(g.a)(i.prototype),"stopRotating",this).call(this)}},{key:"shoot",value:function(){this.message.sendMessage("blt3,".concat(Date.now()))}},{key:"isTankInBoundary",value:function(){return this.mesh.position.x<this.boundary.x&&this.mesh.position.x>-this.boundary.x&&this.mesh.position.y<this.boundary.y&&this.mesh.position.y>-this.boundary.y}},{key:"updateBoundary",value:function(t){this.boundary=t}}]),i}(V),U=i(34),X=function(){function t(e){Object(m.a)(this,t),this.config=void 0,this.message=void 0,this.id=void 0,this.scene=void 0,this.camera=void 0,this.renderer=void 0,this.me=void 0,this.players=void 0,this.clock=void 0,this.light=void 0,this.stats=void 0,this.playBoundary=void 0,this.scoreContainer=void 0,this.config=e,this.id=e.id,this.players={},this.message=new T(this.id),this.scene=new A.m,this.scene.background=new A.d(11329415),this.camera=new A.k(75,window.innerWidth/window.innerHeight,.1,999),this.camera.position.set(0,0,150),this.camera.lookAt(0,0,-150);var i=new A.a(16777215,.5);this.scene.add(i),this.light=new A.f(16777215,1),this.light.position.set(0,-80,150),this.light.target.position.set(0,0,0),this.scene.add(this.light),this.scene.add(this.light.target),this.renderer=new A.s({antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.stats=new U,this.stats.showPanel(0);var s=n.a.createElement(N,{scores:[],id:this.id}),o=document.getElementById(e.canvasParentId),a=document.getElementById("stat-container");this.scoreContainer=document.createElement("div"),this.scoreContainer.id="score-containter",r.a.render(s,this.scoreContainer),o.appendChild(this.renderer.domElement),this.stats.dom.style.removeProperty("position"),a.appendChild(this.stats.dom),o.appendChild(this.scoreContainer),this.registerEvents(),this.clock=new A.c,this.clock.getDelta(),this.animate()}return Object(w.a)(t,[{key:"addMe",value:function(){var t=Object(y.a)(f.a.mark((function t(){var e,i,s;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.message.getConnection();case 2:t.sent&&(this.updatePlayBoundary(),e=A.h.randFloat(-this.playBoundary.x,this.playBoundary.x),i=A.h.randFloat(-this.playBoundary.y,this.playBoundary.y),s=A.h.randFloat(0,Math.PI),this.message.sendMessage("st3,".concat(e,",").concat(i,",").concat(s,",").concat(Date.now())),this.message.sendMessage("bon,".concat(this.playBoundary.x,",").concat(this.playBoundary.y)),this.message.listenOnMessage(this.handleMessages.bind(this)));case 4:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"animate",value:function(){if(this.stats.begin(),requestAnimationFrame(this.animate.bind(this)),this.renderer.render(this.scene,this.camera),this.me){var t=Object.values(this.players).map((function(t){return t.mesh}));for(var e in this.me.bullets){var i=this.me.bullets[e];i.isHit||(i.isHit=i.collisionWithMeshes(t),i.isHit&&this.message.sendMessage("hit3,".concat(e)))}this.updateScore()}this.stats.end()}},{key:"updateCamera",value:function(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()}},{key:"updatePlayBoundary",value:function(){var t=new A.r,e=new A.r;t.set(1,1,.5),t.unproject(this.camera),t.sub(this.camera.position).normalize();var i=-this.camera.position.z/t.z;e.copy(this.camera.position).add(t.multiplyScalar(i)),this.playBoundary=e}},{key:"updateDebugInfo",value:function(){var t={playerPosition:this.me.mesh.position,playerRotation:this.me.mesh.rotation};console.log(t)}},{key:"updateScore",value:function(){var t={id:this.me.id,score:this.me.score},e=Object.values(this.players).map((function(t){return{id:t.id,score:t.score}}));e.push(t),e.sort((function(t,e){return e.score-t.score}));var i=n.a.createElement(N,{scores:e,id:t.id});r.a.render(i,this.scoreContainer)}},{key:"registerEvents",value:function(){var t=this;window.addEventListener("resize",(function(){t.updateCamera(),t.me&&(t.updatePlayBoundary(),t.message.sendMessage("bon,".concat(t.playBoundary.x,",").concat(t.playBoundary.y))),t.renderer.setSize(window.innerWidth,window.innerHeight)})),window.addEventListener("keydown",this.keydownListener.bind(this)),window.addEventListener("keyup",this.keyupListener.bind(this))}},{key:"keydownListener",value:function(t){this.me&&("w"===t.key&&this.me.moveForward(),"s"===t.key&&this.me.moveBackward(),"a"===t.key&&this.me.rotateLeft(),"d"===t.key&&this.me.rotateRight()," "===t.key&&this.me.allowShoot&&(this.me.allowShoot=!1,this.me.shoot()))}},{key:"keyupListener",value:function(t){this.me&&("w"===t.key&&this.me.isMovingForward()&&this.me.stopMoving(),"s"===t.key&&this.me.isMovingBackward()&&this.me.stopMoving(),"a"===t.key&&this.me.isRotatingLeft()&&this.me.stopRotating(),"d"===t.key&&this.me.isRotatingRight()&&this.me.stopRotating()," "===t.key&&(this.me.allowShoot=!0))}},{key:"handleMessages",value:function(t){var e=t.indexOf(","),i=t.substring(0,e),s=t.substring(e+1);switch(i){case"pos3":this.updatePlayersAndBulletsPostion(s);break;case"blt":this.updateBullets(s)}}},{key:"updatePlayersAndBulletsPostion",value:function(t){var e=this,i=JSON.parse(t),s=Object.keys(i),o=Object.keys(this.players);s.forEach((function(t){var s=i[t];if(t===e.id){if(!e.me){var o={color:new A.d(16776960),bltColor:new A.d(16711680)};e.me=new q(e.scene,e.id,e.message,e.playBoundary,o),e.message.sendMessage("stup,".concat(e.me.speedMove,",").concat(e.me.speedRotate,",").concat(e.me.speedBullet))}e.me.updatePosByServer(s.pos.x,s.pos.y,s.pos.r),e.me.updateBulletsByServer(s.blt,t),e.me.score=s.scor}else{if(!e.players[t]){var n={color:new A.d(65535),bltColor:new A.d(16711680)},a=new V(e.scene,t,n);e.players[t]=a}var r=e.players[t];r.updatePosByServer(s.pos.x,s.pos.y,s.pos.r),r.updateBulletsByServer(s.blt,t),r.score=s.scor}})),o.filter((function(t){return!s.includes(t)})).forEach((function(t){e.players[t].destory(),delete e.players[t],console.log("player ".concat(t," exits"))}))}},{key:"updateBullets",value:function(t){var e=t.split(",");Object(h.a)(e,1)[0];this.id}}]),t}(),Z=function(){var t,e=d().gameData;return Object(o.useEffect)((function(){var i=window.innerWidth,s=window.innerHeight;t||(t=new X({width:i,height:s,canvasParentId:"game-container",syncRate:100,id:e.id})).addMe()}),[]),Object(s.jsxs)("div",{id:"overall-container",children:[Object(s.jsx)("div",{id:"game-container"}),Object(s.jsx)("div",{id:"stat-container"})]})},$=(i(35),function(){var t=Object(o.useRef)(null),e=Object(o.useRef)(null),i=d(),n=i.setGameData,a=i.gameData;Object(o.useEffect)((function(){e.current&&(e.current.checked=a.engine)}),[]);return Object(s.jsx)("div",{id:"tank-name-form",children:Object(s.jsxs)("form",{onSubmit:function(i){i.preventDefault();var s="",o=!0;t.current&&t.current.value&&(s=t.current.value),e.current&&(o=e.current.checked),n({id:s,engine:o})},children:[Object(s.jsx)("div",{className:"form-div",children:Object(s.jsx)("input",{id:"tank-name",size:50,placeholder:"please name your tank",ref:t})}),Object(s.jsxs)("div",{className:"form-div",children:[Object(s.jsx)("input",{id:"threejs-engine",type:"checkbox",ref:e}),Object(s.jsx)("label",{htmlFor:"threejs-engine",children:"Engine Mode"})]}),Object(s.jsx)("button",{children:"Start"})]})})});var K=function(){var t=Object(o.useState)({id:"",engine:!0}),e=Object(h.a)(t,2),i=e[0],n=e[1];return console.log(i),Object(s.jsx)(c.Provider,{value:{gameData:i,setGameData:n},children:Object(s.jsx)("div",{className:"App",children:i.id?i.engine?Object(s.jsx)(Z,{}):Object(s.jsx)(W,{}):Object(s.jsx)($,{})})})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(Object(s.jsx)(K,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[36,1,2]]]);
//# sourceMappingURL=main.25dc21a8.chunk.js.map