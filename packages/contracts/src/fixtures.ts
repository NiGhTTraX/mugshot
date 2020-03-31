export const fixtures = {
  rect: `<html lang="en">
    <head>
        <title>Rect</title>
        <style>
            .test {
                position: absolute;
                left: 8px;
                top: 10px;
                width: 100px;
                height: 100px;
                border: 2px solid blue;
                margin: 3px;
                padding: 4px;
                background: coral;
            }
        </style>
    </head>
    <body>
    <div class="test"></div>
    </body>
    </html>`,
  'rect-scroll': `<html lang="en">
    <head>
        <title>Rect with scroll</title>
        <style>
            .test {
                position: absolute;
                left: 2000px;
                top: 2000px;
                width: 100px;
                height: 100px;
                background: coral;
            }
        </style>
      </head>
    <body>
    <div class="test"></div>
    </body>
    </html>`,
  'rect-multiple': `<html lang="en">
    <head>
        <title>Multiple rects</title>
        <style>
            .multiple {
                position: absolute;
                width: 100px;
                height: 100px;
                background: coral;
            }
        </style>
      </head>
    <body>
    <div class="multiple" style="left: 0; top: 0;"></div>
    <div class="multiple" style="left: 100px; top: 0;"></div>
    <div class="multiple" style="left: 0; top: 100px;"></div>
    <div class="multiple" style="left: 100px; top: 100px;"></div>
    </body>
    </html>`,
  'rect-invisible': `<html lang="en">
    <head>
        <title>Invisible rect</title>
        <style>
            .invisible {
                display: none;
            }
        </style>
      </head>
    <body>
    <div id="visible">visible</div>
    <div id="invisible" class="invisible">invisible</div>
    </body>
    </html>`,
  simple: `<html lang="en">
    <body>
    This is some simple HTML
    <div style="width: 100px; height: 100px; border: 1px solid blue; background: coral"></div>
    </body>
    </html>`,
};
