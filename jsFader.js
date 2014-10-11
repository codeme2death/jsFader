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
* variables
        parentType ~ the main wrapper for the elements. default is a list item but div's, span's or dsomthing else could be used
        childElement  ~ The child element type that will fade. It has to be directly after the parent element. no nested divs or list items.
*       counter ~ main counter for elements
        elements ~ list of elements 
        fadeOut ~ holds the time out for the fade out
        fadeIn ~ holds the time out for the fade out 
        timeOut ~ initial timeout if none is given
        fadeInTime  ~ sets the fade out time through parameters. Default takes the time out time and divides by 1000
        fadeOutTime ~ sets the fade in time through parameters. Default takes the time out time and divides by 1000
        fadeBy : ~ sets the amount to fade by. default is 2px but could be increased to add faster fade.
        className ~ the class Name the search for default is jsFader but could be something else
        
        lastTimeRan ~ marks the last time the program ran. used internally
        lastFadeTimeRan ~ marks the last time the fade ran. used internally
        isRunning ~ marks whether or not the program is running. set to false to stop execusion
        isFadeRunning ~ marker to see if fade is running. It prevents happy clickers from clicking to fast and screwing up the animation.
        currentFadeOut ~ the pixel amount to start the fade at set to lower if you don't want full opacity when it fades out.
        
        runSetTimer ~ this sets whether or not the program uses the setTimeout method or requestAnimationFrame for newer browser support
*/ 


var jsFader = {
        parentType : 'ul',
        childElement : 'li',
        counter : -1,
        elements : null,
        fadeOut : 0,
        fadeIn: 0 ,
        timeOut : 5000,
        fadeInTime : 0,
        fadeOutTime : 0,
        fadeBy : 2,
        className : 'jsFader',
        lastTimeRan : '',
        lastFadeTimeRan : '',
        isRunning : true,
        isFadeRunning : false,
        currentFadeOut : 100,
        runSetTimer : false,
        changeElement : function() {
            if(jsFader.elements) {
                if(jsFader.isRunning === true) {
                    var length = jsFader.elements.length;

                    if(jsFader.counter >= length) {
                        jsFader.counter = 0;
                    }
                    if(jsFader.elements[jsFader.counter]) {   
                        jsFader.fadeOutAnimation(jsFader.currentFadeOut,jsFader.elements[jsFader.counter]);
                    }                            
                    jsFader.counter++;
                    if(jsFader.elements[jsFader.counter]) {            
                        jsFader.fadeInAnimation(0,jsFader.elements[jsFader.counter]);                
                    } else {               
                        jsFader.fadeInAnimation(0,jsFader.elements[0]);
                    }
                }
            }
            jsFader.lastTimeRan = new Date().getTime(); 
        },
        fireAnimationChange : function() {
            //uses the requestAnimationFrame for newer browsers
            currenTime = new Date().getTime();
            difference = currenTime - jsFader.lastTimeRan;
            if(difference >= jsFader.timeOut) {
                jsFader.changeElement();
            }
            if(jsFader.isRunning === true) {
                jsFader.timer = window.requestAnimationFrame(jsFader.fireAnimationChange);
            } else {
                jsFader.checkList();
            }
        },
        fireTimerChange : function() {
            //uses the setTimeout for older browsers
            jsFader.changeElement();
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
                        jsFader.fadeOutTime = jsFader.timeOut / 1000;
                    }
                    pixels = pixels - jsFader.fadeBy;
                    opacityPixels = pixels / 100;
                    element.style.opacity = opacityPixels;
                    element.style.filter = 'alpha(opacity=' + pixels + ')'; 
                    if(jsFader.runSetTimer === true) {
                        var localFade = function() {
                            jsFader.fadeOutAnimation(pixels,element)
                        };
                        setTimeout(localFade,jsFader.fadeOutTime);                        
                        
                    } else {       
                        jsFader.fadeOut = window.requestAnimationFrame(function() {
                            currenTime = new Date().getTime();
                            difference = currenTime - jsFader.lastTimeRan;                         
                            if(difference >= jsFader.fadeOutTime) {
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
                        jsFader.fadeInTime = jsFader.timeOut / 1000;
                    }                 
                    pixels = pixels + jsFader.fadeBy;
                    opacityPixels = pixels / 100;
                    element.style.opacity = opacityPixels;
                    element.style.filter = 'alpha(opacity=' + pixels + ')'; 
                    if(jsFader.runSetTimer === true) {
                        var localFade = function() {
                            jsFader.fadeInAnimation(pixels,element);
                        };                        
                        setTimeout(localFade,jsFader.fadeInTime);                             
                        
                    } else {            
                        jsFader.fadeIn = window.requestAnimationFrame(function(fadeInTimeOut) { 
                            currenTime = new Date().getTime();
                            difference = currenTime - jsFader.lastTimeRan;                     
                            if(difference >= jsFader.fadeInTime) {
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
            window.clearInterval(jsFader.fadeOut);
            jsFader.fadeOut = false;
            window.clearInterval(jsFader.fadeIn);
            jsFader.fadeIn = false;            
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
            var length = jsFader.elements.length;
            if(jsFader.counter === length) {
                jsFader.counter = 0;
            }
            console.log(jsFader.counter + "," + length);
            for(var i = 0; i < length; ++i) {
                
                if(i !== jsFader.counter) {
                    jsFader.elements[i].style.opacity = '0';
                    jsFader.elements[i].style.filter = 'alpha(opacity=0)'; 
                    jsFader.elements[i].style.visibility = "hidden";
                    jsFader.elements[i].style.display = "none";                    
                } 
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
            if(jsFader.elements[jsFader.counter]) {
                jsFader.elements[jsFader.counter].style.opacity = '-0.02';
                jsFader.elements[jsFader.counter].style.filter = 'alpha(opacity=0)'; 
                jsFader.elements[jsFader.counter].style.visibility = "hidden";
                jsFader.elements[jsFader.counter].style.display = "none";          
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
            timer = jsFader.toNumber(timer)
            if(timer !== '') {
                if(timer > 0) {
                    if(timer > 100) {
                        jsFader.timeOut = timer;
                    }
                }    
            }
        },
        setFadeInTime : function(timer) {
            timer = jsFader.toNumber(timer)
            if(timer > 0) {
                if(timer <= jsFader.timeOut) {
                    jsFader.fadeInTime = timer;
                }
            }    
        },
        setFadeOutTime : function(timer) {
            timer = jsFader.toNumber(timer)
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
            amount = jsFader.toNumber(amount);
            if(amount > 0 && isNaN(amount)) {
                jsFader.fadeBy = amount;
            }    
        },         
        toNumber : function(stringText) {
            if(stringText !== '') {
                var pat = new RegExp(/[^0-9]/gi);
                stringText = stringText.toString();
                stringText = stringText.replace(pat, "");
            }
            if(stringText === "") {
                stringText = "0";
            }
            stringText = parseInt(stringText);
            return stringText;
        },
        
        start : function(element,props) {   
            var browser = jsFader.getBrowser();
            var browserVersion = jsFader.getBrowserVersion();
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
            jsFader.elements = jsFader.getList(element);
            if(jsFader.elements) {
                if(jsFader.runSetTimer=== true) {
                    jsFader.fireTimerChange();
                } else {
                    jsFader.fireAnimationChange();
                }
            }
            this.stopAnimation = function() {
                jsFader.stopAnimation();
                jsFader.checkList();
                
            };
            this.startAnimation = function() {
                if(jsFader.isRunning === false) {
                    if(jsFader.isFadeRunning === false) {
                        jsFader.startAnimation();
                    }
                }
            };           
            this.setPosition = function(position) {                
                var length = jsFader.elements.length;
                position = jsFader.toNumber(position);
                if(position === 0) {
                    position = 1;
                }
                position = position -1;
                if(position >= length) {                    
                    position = length - 1;
                }
                if(position < 0) {
                    position = 0;
                }               
                
                //clear running 
                window.clearInterval(jsFader.fadeOut);
                jsFader.fadeOut = false;
                window.clearInterval(jsFader.fadeIn);
                jsFader.fadeIn = false;
                
                
                jsFader.counter = position;
                jsFader.checkList();
                jsFader.stopAnimation();
                                    
                jsFader.fadeInAnimation(0,jsFader.elements[position]);     
            };
            this.next = function() { 
                if(jsFader.isFadeRunning === false) {
                    jsFader.counter = jsFader.counter + 1;
                    var length = jsFader.elements.length;
                    if(jsFader.counter >= length) {                    
                        jsFader.counter = 0;
                    }
                    if(jsFader.counter < 0) {
                        jsFader.counter = length -1;
                    }               

                    //clear running 
                    window.clearInterval(jsFader.fadeOut);
                    jsFader.fadeOut = false;
                    window.clearInterval(jsFader.fadeIn);
                    jsFader.fadeIn = false;

                    jsFader.checkList();
                    jsFader.stopAnimation();

                    jsFader.fadeInAnimation(0,jsFader.elements[jsFader.counter]);     
                } 
                
            }; 
            this.previous = function() {
                if(jsFader.isFadeRunning === false) {
                    jsFader.counter = jsFader.counter - 1;
                    var length = jsFader.elements.length;
                    if(jsFader.counter >= length) {                    
                        jsFader.counter = 0;
                    }
                    if(jsFader.counter < 0) {
                        jsFader.counter = length -1;
                    }               

                    //clear running 
                    window.clearInterval(jsFader.fadeOut);
                    jsFader.fadeOut = false;
                    window.clearInterval(jsFader.fadeIn);
                    jsFader.fadeIn = false;

                    jsFader.checkList();
                    jsFader.stopAnimation();

                    jsFader.fadeInAnimation(0,jsFader.elements[jsFader.counter]);                      
                }
            };             
        } 
    };
    
    jsFader.addEvent(window,'load',jsFader.bindByClass);

    