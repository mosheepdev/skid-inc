skidinc.script = {};
skidinc.script.available = true;
skidinc.script.current = null;
skidinc.script.time = 0;
skidinc.script.maxTime = 0;
skidinc.script.maxBar = 40;
skidinc.script.unlocked = [true, false, false, false, false, false, false, false];
skidinc.script.completed = [0, 0, 0, 0, 0, 0, 0, 0];
skidinc.script.scripts = [{
    id: 'hare.ctx',
    cost: 0,
    money: 50,
    exp: 5,
    time: 4,
    i: 0
}, {
    id: 'yerg.trj',
    cost: 475,
    money: 600,
    exp: 150,
    time: 12,
    i: 1
}, {
    id: 'acid.pl',
    cost: 14400,
    money: 7200,
    exp: 600,
    time: 36,
    i: 2
}, {
    id: 'memz.rsm',
    cost: 172800,
    money: 86400,
    exp: 2400,
    time: 108,
    i: 3
}, {
    id: 'gruel.vbs',
    cost: 2073600,
    money: 1036800,
    exp: 9600,
    time: 324,
    i: 4
}, {
    id: 'cih.win',
    cost: 24883200,
    money: 12441600,
    exp: 38400,
    time: 972,
    i: 5
}, {
    id: 'worm.cs',
    cost: 298598400,
    money: 149299200,
    exp: 153600,
    time: 2916,
    i: 6
}, {
    id: 'blazer.dos',
    cost: 3583180800,
    money: 1791590400,
    exp: 614400,
    time: 8748,
    i: 7
}];

skidinc.script.isExecuted = function() {
    var executed = !this.available;
    return executed.toString();
};

skidinc.script.getName = function() {
    if (this.available)
        return 'none';
    else
        return this.current.id;
};

skidinc.script.help = function() {
    var str = '<y>SCRIPT HELP</y> execute scripts to earn money and experience:<br>' +
        '<b>-</b> to execute a script you must put the <b>script name</b> as the first argument.<br>' +
        '<b>-</b> you can get a list of all available scripts with <b>-l/-list</b> argument.<br>' +
        '<b>-</b> to stop a script, use the argument <b>-c/-cancel</b>.';
    
    return skidinc.console.print(str);
};

skidinc.script.list = function() {
    var str = '<y>SCRIPT LIST</y>:<br>';
    
    for (var script in skidinc.script.scripts) {
        var i = script,
            script = skidinc.script.scripts[i],
            unlocked = skidinc.script.unlocked[script.i];
        
        str += '<b>-</b> <b>';
        
        if (!unlocked)
            str += '<red>' + script.id + '</red>';
        else
            str += '<green>' + script.id + '</green>';
        
        str += '</b>: <b>+$' + fix(script.money, 0) + '</b> and <b>+' + fix(script.exp, 0) + ' exp</b>, cost <b>$' + fix(script.cost, 0) + '</b>, execution takes <b>' + fix(script.time, 0) + ' sec</b>.<br>';
    };
    
    return skidinc.console.print(str);
};

skidinc.script.listBuy = function() {
    var str = '',
        e = 0;
    
    for (var script in skidinc.script.scripts) {
        var i = script,
            script = skidinc.script.scripts[i],
            unlocked = skidinc.script.unlocked[script.i];
        
        if (!unlocked)
            str += '<red>' + script.id + '</red>';
        else
            str += '<green>' + script.id + '</green>';
        
        e++;
        
        if (e !== skidinc.script.scripts.length)
            str += ', ';
        else
            str += ' (<b>script -l/-list</b> for a detailed list).';
    };
    
    return str;
};

skidinc.script.execute = function(args) {
    var exists = false,
        s;
    
    for (var script in skidinc.script.scripts) {
        var i = script,
            script = skidinc.script.scripts[i];
        
        if (args[0] == script.id) {
            exists = true;
            s = script;
        };
    };
    
    if (!exists)
        return skidinc.console.print('<x>ERR</x> <b>' + args[0] + '</b> is not valid script name.');
    
    if ((args[1] == '-c' || args[1] == '-cancel') && args.length > 1)
        return skidinc.script.stop(s);
    
    if (exists && args.length == 1)
        return skidinc.script.start(s);
};

skidinc.script.start = function(script) {
    if (!skidinc.script.available)
        return skidinc.console.print('<x>ERR</x> you can\'t execute multiple scripts at once.');
    
    if (skidinc.autoscript.unlocked[script.i])
        return skidinc.console.print('<x>ERR</x> you already have an autoscript for <b>' + script.id + '</b> script.');
        
    if (!skidinc.script.unlocked[script.i])
        return skidinc.console.print('<x>ERR</x> you haven\'t unlocked the <b>' + script.id + '</b> script.');
    
    var el = (skidinc.tutorial.enabled) ? '#intro-logs' : '#logs';
    
    skidinc.script.available = false;
    skidinc.script.current = script;
    skidinc.script.time = script.time / skidinc.player.getTimeMult();
    skidinc.script.maxTime = script.time / skidinc.player.getTimeMult();
    skidinc.console.print('<y>SCRIPT STARTED</y>: <b>' + script.id + '</b>.');
    
    
    $(el).append('<span id="script-bar">|========================================|</span>');
};

skidinc.script.stop = function(script) {
    if (skidinc.script.available)
        return skidinc.console.print('<x>ERR</x> there are no script executed.');
    
    if (skidinc.autoscript.unlocked[script.i])
        return skidinc.console.print('<x>ERR</x> you can\'t stop the autoscript for <b>' + script.id + '</b> script.');
    
    if (script.id !== skidinc.script.current.id)
        return skidinc.console.print('<x>ERR</x> this script is not executed.');
    
    skidinc.console.print('<y>SCRIPT STOPPED</y>: <b>' + skidinc.script.scripts[skidinc.script.current.i].id + '</b>.');
    skidinc.script.available = true;
    skidinc.script.current = null;
    skidinc.script.time = 0;
    skidinc.script.maxTime = 0;
};

skidinc.script.finish = function() {
    var script = skidinc.script.current,
        money = script.money * skidinc.player.getMoneyMult(),
        exp = script.exp * skidinc.player.getExpMult(),
        bar = '|';
    
    for (var i = 0; i < this.maxBar; i++)
        bar += '#';
    
    bar += '| <y>100%</y>.';
    
    skidinc.player.earn('money', money);
    skidinc.player.earn('exp', exp);
    
    skidinc.script.completed[script.i]++;
    
    skidinc.script.available = true;
    skidinc.script.current = null;
    skidinc.script.time = 0;
    skidinc.script.maxTime = 0;
    
    if (skidinc.tutorial.enabled && skidinc.tutorial.step == 2)
        skidinc.tutorial.switchStep(3);
    
    $('#script-bar').html(bar).attr('id', 'old-script-bar');
    
    return skidinc.console.print('<y>SCRIPT FINISHED</y>: <b>' + script.id + '</b> just finished its execution, you earned <b>$' + fix(money, 0) + '</b> and <b>' + fix(exp, 0) + ' exp</b>.');
};

skidinc.script.bar = function() {
    if ($('#script-bar').length == 1) {
        var bar = '|',
            percent = (this.maxTime - this.time) / this.maxTime * 100,
            left = Math.floor(this.time / this.maxTime * this.maxBar),
            filled = Math.ceil(this.maxBar - left);
    
        for (var i = 0; i < filled; i++)
            bar += '#';
    
        for (var e = 0; e < left; e++)
            bar += '=';
    
        bar += '| <y>' + fix(percent, 0) + '%</y>.';
    
        $('#script-bar').html(bar);
    };
};

skidinc.script.buy = function(what) {
    var exists = false,
        s;
    
    for (var script in skidinc.script.scripts) {
        var i = script,
            script = skidinc.script.scripts[i];
        
        if (what == script.id) {
            exists = true;
            s = script;
        };
    };
    
    if (!exists)
        return skidinc.console.print('<x>ERR</x> <b>' + what + '</b> is not a known script name.');
    
    if (exists) {
        if (skidinc.script.unlocked[s.i])
            return skidinc.console.print('<x>ERR</x> you already unlocked <b>' + s.id + '</b> script.');
        if (skidinc.player.money < s.cost)
            return skidinc.console.print('<x>ERR</x> not enough money to buy <b>' + s.id + '</b> script (cost <b>$' + fix(s.cost) + '</b>).');
        else {
            skidinc.player.money -= s.cost;
            skidinc.script.unlocked[s.i] = true;
            return skidinc.console.print('You bought <b>' + s.id + '</b> script.');
        };
    };
};

skidinc.script.loop = function(times) {
    if (!skidinc.script.available && typeof skidinc.script.current == 'object') {
        skidinc.script.time -= times / skidinc.interval;
        
        skidinc.script.bar();
        
        if (skidinc.script.time <= 0)
            skidinc.script.finish();
    };
};

skidinc.script.init = function() {
    if (skidinc.script.scripts.length !== skidinc.script.unlocked.length) {
        skidinc.script.unlocked = [];
        
        skidinc.script.scripts.forEach(function(i) {
            skidinc.script.unlocked.push(false);
        });
        
        skidinc.script.scripts[0] = true;
    };
};