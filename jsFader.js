/* Created by Matthew M Burton
 * Created : 08/05/2014
 * Version 1.0.0
 * License : Do what you want with it. :-) However, please do not steal my work this took me about a day to write and test so at the least give me credit. Thanks.
 * Works with Firefox,Chrome,IE 5 through Edge amazingly. The fact that IE5 loads is a wonder.
 * sample usage: 
 * To activate it on a list simple add the class jsFader and if you want parameters otherwise just add jsFader as a class
 * You can set the time out, fade in and out time and the amount to fade by in pixels
 *     <ul id="commentSlider" class="jsFader{fadeOut:10,fadeIn:10,fadeBy:5,timer:1000}">
        <li>Hello to my lovely wife </li>
        <li>I love you.</li>
        <li>You are my best friend</li>
    </ul>
* By default the time out is 5 seconds and hard coded to not go below a second. 
* currently multi list fades are not supported. I will work on that later.
* It should automatically detect IE 10 and down and set runSetTimer to true so that it will use the 
*/ 


var jsFader = {
        counter : -1,
        liElements : null,
        fadeOut : 0,
        fadeIn: 0 ,
        element : '',
        timeOut : 5000,
        fadeInTime : 0,
        fadeOutTime : 0,
        fadeBy : 2,
        className : 'jsFader',
        parentType : 'ul',
        lastTimeRan : '',
        lastFadeTimeRan : '',
        isRunning : true,
        isFadeRunning : false,
        currentFadeOut : 100,
        childElement : 'li',
        runSetTimer : false,
        changeText : function() {
            if(jsFader.liElements) {
                var length = jsFader.liElements.length;
                
                if(jsFader.counter >= length) {
                    jsFader.counter = 0;
                }
                if(jsFader.liElements[jsFader.counter]) {   
                    jsFader.fadeOutAnimation(jsFader.currentFadeOut,jsFader.liElements[jsFader.counter]);
                }                            
                jsFader.counter++;
                if(jsFader.liElements[jsFader.counter]) {            
                    jsFader.fadeInAnimation(0,jsFader.liElements[jsFader.counter]);                
                } else {               
                    jsFader.fadeInAnimation(0,jsFader.liElements[0]);
                }
            }
            jsFader.lastTimeRan = new Date().getTime(); 
        },
        fireAnimationChange : function() {
            currenTime = new Date().getTime();
            difference = currenTime - jsFader.lastTimeRan;
            if(difference >= jsFader.timeOut) {
                jsFader.changeText();
            }
            if(jsFader.isRunning === true) {
                jsFader.timer = window.requestAnimationFrame(jsFader.fireAnimationChange);
            } else {
                jsFader.checkList();
            }
        },
        fireTimerChange : function() {
            jsFader.changeText();
            if(jsFader.isRunning === true) {
                setTimeout(function(){
                    jsFader.fireTimerChange();
                },jsFader.timeOut);
            } else {
                jsFader.checkList();
            }              

        },        
        fadeOutAnimation: function(pixels,element) {          
            if(element) {
                if(pixels >= 0) {
                    jsFader.lastFadeTimeRan = new Date().getTime();
                    jsFader.isFadeRunning = true;
                    if(jsFader.fadeOutTime === 0) {
                        fadeOutTimeOut = jsFader.timeOut / 1000;
                    } else {
                        fadeOutTimeOut = jsFader.fadeOutTime;
                    }
                    pixels = pixels - jsFader.fadeBy;
                    opacityPixels = pixels / 100;
                    element.style.opacity = opacityPixels;
                    element.style.filter = 'alpha(opacity=' + pixels + ')'; 
                    if(jsFader.runSetTimer === true) {
                        setTimeout(function(){
                            jsFader.fadeOutAnimation(pixels,element)
                        },fadeOutTimeOut);                        
                        
                    } else {       
                        jsFader.fadeOut = window.requestAnimationFrame(function() {
                            currenTime = new Date().getTime();
                            difference = currenTime - jsFader.lastTimeRan;
                            if(jsFader.fadeOutTime === 0) {
                               fadeOutTimeOut = jsFader.timeOut / 1000;
                            } else {
                               fadeOutTimeOut = jsFader.fadeOutTime;
                            }                           
                            if(difference >= fadeOutTimeOut) {
                                jsFader.fadeOutAnimation(pixels,element);
                            }
                        });  
                    }                    
                      
                } else {
                    window.clearInterval(jsFader.fadeOut);
                    jsFader.isFadeRunning = false;
                    jsFader.lastFadeTimeRan = new Date().getTime();
                    pixels = 0;
                    element.style.visibility = "hidden";
                    element.style.display = "none";
                    element.style.left = "-10000";
                    element.style.opacity = "0";
                }
            }
        },
        fadeInAnimation : function(pixels,element) {
            if(element) {
                jsFader.lastFadeTimeRan = new Date().getTime();
                jsFader.isFadeRunning = true;
                element.style.visibility = "visible";
                element.style.display = "block";
                element.style.left = "0px";
                if(pixels <= 100) {
                    if(jsFader.fadeInTime === 0) {
                        fadeOutTimeOut = jsFader.timeOut / 1000;
                    } else {
                        fadeInTimeOut = jsFader.fadeInTime;
                    }                    

                    pixels = pixels + jsFader.fadeBy;
                    opacityPixels = pixels / 100;
                    element.style.opacity = opacityPixels;
                    element.style.filter = 'alpha(opacity=' + pixels + ')'; 
                    if(jsFader.runSetTimer === true) {
                        setTimeout(function(){
                            jsFader.fadeInAnimation(pixels,element);
                        },fadeInTimeOut);                             
                        
                    } else {            
                        jsFader.fadeIn = window.requestAnimationFrame(function(fadeInTimeOut) { 
                            currenTime = new Date().getTime();
                            difference = currenTime - jsFader.lastTimeRan;
                            if(jsFader.fadeOutTime === 0) {
                               fadeOutTimeOut = jsFader.timeOut / 1000;
                            } else {
                               fadeOutTimeOut = jsFader.fadeInTime;
                            }                           
                            if(difference >= fadeOutTimeOut) {
                                jsFader.fadeInAnimation(pixels,element);
                            }                            
                            
                        });
                    }                       

                } else {
                    jsFader.isFadeRunning = false;
                    jsFader.lastFadeTimeRan = new Date().getTime();
                    window.clearInterval(jsFader.fadeIn);
                }
            }
        },              
        stopAnimation : function() {
            jsFader.isRunning = false;
            
            //window.requestAnimationFrame(jsFader.fireAnimationChange);
        },
        startAnimation : function() {
            jsFader.checkList();            
            jsFader.isRunning = true;
            if(jsFader.runSetTimer === true) {
                jsFader.fireTimerChange();
            } else {            
                window.requestAnimationFrame(jsFader.fireAnimationChange);
            }
        },        
        checkList : function() {
            //makes sure there are not items showing that are not supposed to.
            var length = jsFader.liElements.length;
            for(var i = 0; i < length; ++i) {
                jsFader.liElements[i].style.opacity = '0';
                jsFader.liElements[i].style.filter = 'alpha(opacity=0)'; 
                jsFader.liElements[i].style.visibility = "hidden";
                jsFader.liElements[i].style.display = "none";                    
            }
        },
        getList: function(element) {
            var listItems = [];
            if(element) {
                var children = element.childNodes;

                for(var i = 0, l=children.length; i<l; ++i) {
                    var child = children[i];
                    if(child.tagName) {
                        if(child.tagName.toLowerCase() === jsFader.childElement) {
                            listItems.push(child);
                        }
                    }
                }       
            }
            return listItems;
        },
        killCurrentFade : function() {
            if(jsFader.liElements[jsFader.counter]) {
                jsFader.liElements[jsFader.counter].style.opacity = '-0.02';
                jsFader.liElements[jsFader.counter].style.filter = 'alpha(opacity=0)'; 
                jsFader.liElements[jsFader.counter].style.visibility = "hidden";
                jsFader.liElements[jsFader.counter].style.display = "none";          
            }
        },
        bindByClass : function() {
            var matchClass = new RegExp('(^|\\s)('+jsFader.className+')\\s*(\\{[^}]*\\})?', 'i');
            var e = document.getElementsByTagName(jsFader.parentType);   
            for(var i=0; i<e.length;i++)   {
                if(!e[i].jsFader && e[i].className && (m = e[i].className.match(matchClass))) { 
                    var prop = {};
                        if(m[3]) {
                            try {
                                 prop = (new Function ('return (' + m[3] + ')'))();
                            } catch(eInvalidProp) {}
                        }
                    e[i].jsFader = new jsFader.start(e[i],prop);
                }
            }            
        },        
        addEvent : function(el, evnt, func) {
            if(el.addEventListener) {
                el.addEventListener(evnt, func, false);
            } else if(el.attachEvent) {
                el.attachEvent('on'+evnt, func);
            }
        },
        setTimer : function(timer) {
            timer = jsFader.stripChar(timer)
            if(timer !== '') {
                if(timer > 0) {
                    if(timer > 100) {
                        jsFader.timeOut = timer;
                    }
                }    
            }
        },
        setFadeInTime : function(timer) {
            timer = jsFader.stripChar(timer)
            if(timer > 0) {
                if(timer <= jsFader.timeOut) {
                    jsFader.fadeInTime = timer;
                }
            }    
        },
        setFadeOutTime : function(timer) {
            timer = jsFader.stripChar(timer)
            if(timer > 0) {
                if(timer <= jsFader.timeOut) {
                   
                    jsFader.fadeOutTime = timer;
                }
            }    
        },  
        getBrowser : function(){
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            if(/trident/i.test(M[1])) {
                tem= /\brv[ :]+(\d+)/g.exec(ua) || []; 
                Ie = 'IE '+(tem[1]||'');
                return Ie;
            }   
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR\/(\d+)/)
                if(tem!=null) {
                    return 'Opera '+tem[1];
                }
            }   
            
            M=M[2] ? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {
                M.splice(1,1,tem[1]);
            }
            
            return M[0];
        },
        getBrowserVersion : function(){
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];                                                                                                                         
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1]||'');
            }
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR\/(\d+)/)
                if(tem!=null)   {return 'Opera '+tem[1];}
                }   
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {
                M.splice(1,1,tem[1]);
            }
            return M[1];
        },
        setFadeBy : function(amount) {
            amount = jsFader.stripChar(amount);
            if(amount > 0 && isNaN(amount)) {
                jsFader.fadeBy = amount;
            }    
        },         
        stripChar : function(stringText) {
            if(stringText !== '') {
                var pat = new RegExp(/[^0-9]/gi);
                stringText = stringText.toString();
                stringText = stringText.replace(pat, "");
            }
            return stringText;
        },
        
        start : function(element,props) {   
            var browser = jsFader.getBrowser();
            var browserVersion = jsFader.getBrowserVersion();
            alert(browser);
            if(browser.toLowerCase() === 'msie' || browser.toLowerCase() === 'safari') {
                if(browserVersion < 10 ) {
                    jsFader.runSetTimer = true;
                }
            }
            for(var key in props) {
                if(key.toLowerCase() === 'timer') {
                    jsFader.setTimer(props[key]);
                }
                if(key.toLowerCase() === 'fadein') {
                    jsFader.setFadeInTime(props[key]);
                } 
                if(key.toLowerCase() === 'fadeout') {
                    jsFader.setFadeOutTime(props[key]);
                }      
                if(key.toLowerCase() === 'fadeby') {
                    jsFader.setFadeBy(props[key]);
                }       
                if(key.toLowerCase() === 'parentype') {
                    
                    jsFader.parentType = props[key];
                }       
                if(key.toLowerCase() === 'childtype') {
                    jsFader.childType = props[key];
                }                       
            }
            jsFader.liElements = jsFader.getList(element);
            if(jsFader.liElements) {
                if(jsFader.runSetTimer=== true) {
                    jsFader.fireTimerChange();
                } else {
                    jsFader.fireAnimationChange();
                }
            }
            this.stopAnimation = function() {
                if(jsFader.liElements[jsFader.counter]) {
                    opacity = jsFader.liElements[jsFader.counter].style.opacity;            
                    jsFader.fadeInAnimation(0,jsFader.liElements[jsFader.counter]);   
                }
                jsFader.stopAnimation();
            };
            this.startAnimation = function() {
                if(jsFader.isRunning === false) {
                    jsFader.startAnimation();
                }
            };           
            this.setPosition = function(position) {                
                var length = jsFader.liElements.length;
                //position = jsFader.stripChar(position);
                position = position - 1;
                if(position >= length) {                    
                    position = 0;
                }
                if(position < 0) {
                    position = length -1;
                }               
                
                window.clearInterval(jsFader.fadeOut);
                jsFader.fadeOut = false;
                window.clearInterval(jsFader.fadeIn);
                jsFader.fadeIn = false;
                jsFader.checkList();
                jsFader.counter = position;
                jsFader.fadeInAnimation(0,jsFader.liElements[position]);    
                jsFader.stopAnimation();
  
            };
            this.next = function() { 
                if(jsFader.isFadeRunning === false) {
                    this.setPosition(jsFader.counter+2);
                }                
                
            }; 
            this.previous = function() {
                if(jsFader.isFadeRunning === false) {
                    jsFader.checkList();
                    this.setPosition(jsFader.counter);
                }
            };             
        } 
    };
    
    jsFader.addEvent(window,'load',jsFader.bindByClass);

    