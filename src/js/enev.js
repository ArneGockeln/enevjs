/**
 * Created by Arne Gockeln, Webchef.de on 15.06.15.
 *
 * Shows an ENEV 2014 Scala for private and industrial properties
 */
;(function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "enev",
        defaults = {
            "value": 0,
            "isIndustrial": false, // nichtwohnhaus scala
            "nonIndustrialScala": {
                "scalaMin": 0,
                "scalaMax": 250,
                "scalaStep": 25
            },
            "industrialScala": {
                "scalaMin": 0,
                "scalaMax": 1000,
                "scalaStep": 100
            },
            "arrowWidth": 15,
            "showAnimation": true,
            "arrowAnimationDuration": 5000,
            "classes": [
                {"label": "A+", "max": 30},
                {"label": "A", "max": 50},
                {"label": "B", "max": 75},
                {"label": "C", "max": 100},
                {"label": "D", "max": 130},
                {"label": "E", "max": 160},
                {"label": "F", "max": 200},
                {"label": "G", "max": 250},
                {"label": "H", "max": 0}
            ],
            "showDebug": false
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {

            var $container = $(this.element);

            var isIndustrial = this.settings.isIndustrial;
            var scalaMin = (isIndustrial ? this.settings.industrialScala.scalaMin : this.settings.nonIndustrialScala.scalaMin);
            var scalaMax = (isIndustrial ? this.settings.industrialScala.scalaMax : this.settings.nonIndustrialScala.scalaMax);
            var scalaStep = (isIndustrial ? this.settings.industrialScala.scalaStep : this.settings.nonIndustrialScala.scalaStep);

            var $debug = $('<div class="debug"></div>');
            if(this.settings.showDebug){
                $container.after($debug);
            }

            // add html construct
            var $arrowBox = $('<div class="arrow_box"></div>');
            var $gradient = $('<div class="gradient"></div>');
            var $scala1 = $('<ul class="scala1"></ul>');
            var $scala2 = $('<ul class="scala2"></ul>');
            $gradient.append($scala1);
            $gradient.append($scala2);
            $container.append('<!--[if gte IE 9]<style type="text/css">.gradient {filter: none;}</style><![endif]-->');
            $container.append($arrowBox);
            $container.append($gradient);

            var enevValue = ($container.data('enev') != undefined && $container.data('enev').length > 0 ? parseFloat($container.data('enev')) : parseFloat(this.settings.value));

            var arrowOffset = $arrowBox.width()/2;
            var containerWidth = $container.width();
            var scalaValue = (enevValue > scalaMax ? scalaMax : enevValue);
            var arrowMarginLeft = ((containerWidth * (scalaValue/scalaMax))-arrowOffset);

            // add box with value on top of the scala
            $arrowBox.html(enevValue + " kWh/(m<sup>2</sup> &middot; a)");

            // animate box
            if(this.settings.showAnimation){
                $arrowBox.animate({
                    marginLeft: arrowMarginLeft
                }, this.settings.arrowAnimationDuration);
            } else {
                $arrowBox.css('margin-left', arrowMarginLeft);
            }

            // Generate bottom scala first (linear scala)
            // - because of height calculations in industrial
            var cellWidth = (scalaMax/scalaStep);
            for(var scalaCurrent = scalaMin; scalaCurrent < scalaMax; scalaCurrent += scalaStep){
                var liElement = $('<li></li>');
                liElement.html((scalaCurrent == (scalaMax-scalaStep) ? scalaCurrent + '<span>>' + scalaMax + '</span>' : scalaCurrent));
                liElement.css('width', cellWidth + "%");
                $scala2.append(liElement);
            }

            // top scala for nonIndustrial
            // intervall scala
            if(!isIndustrial) {
                var classArray = this.settings.classes;

                var elementCount  = classArray.length-1;
                for(var i = 0; i < elementCount; i++){
                    var elem = classArray[i];

                    var previous = elem.max;
                    if(i > 0){
                        previous = elem.max - classArray[i-1].max;
                    }

                    var cellWidth = (previous/scalaMax) * containerWidth;

                    var liElement = $('<li></li>');
                    liElement.html(elem.label + (i == (classArray.length-2) ? '<span>' + classArray[classArray.length - 1].label + '</span>' : ''));
                    liElement.css('width', cellWidth + "%");
                    $scala1.append(liElement);
                }
            } else {
                // calculate vertical center of bottom scala
                var gradientHeight = $gradient.height();
                var scalaHeight = $scala2.height();
                var marginTop = gradientHeight/2 - scalaHeight/2;
                $scala2.css('margin-top', marginTop + "px");
            }
        },
        debug: function(mixed){
            $('.debug').append(mixed + "<br/>");
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };
})( jQuery, window, document );
