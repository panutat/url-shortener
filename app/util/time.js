// Utilize for computing "since created"
const time = (() => {
    const templates = {
        prefix: '',
        suffix: ' ago',
        seconds: 'less than a minute',
        minute: 'a minute',
        minutes: '%d minutes',
        hour: 'an hour',
        hours: '%d hours',
        day: 'a day',
        days: '%d days',
        month: 'a month',
        months: '%d months',
        year: 'a year',
        years: '%d years',
    };

    function template(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    }

    function timer(sinceTime) {
        let input = sinceTime.replace(/\.\d+/, '');
        input = input.replace(/-/, '/').replace(/-/, '/');
        input = input.replace(/T/, ' ').replace(/Z/, ' UTC');
        input = input.replace(/([\+\-]\d\d):?(\d\d)/, ' $1$2');
        input = new Date(input * 1000 || input);

        const now = new Date();
        const seconds = ((now.getTime() - input) * 0.001) >> 0;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const years = days / 365;

        const string = (
            (seconds < 45 && template('seconds', seconds)) ||
            (seconds < 90 && template('minute', 1)) ||
            (minutes < 45 && template('minutes', minutes)) ||
            (minutes < 90 && template('hour', 1)) ||
            (hours < 24 && template('hours', hours)) ||
            (hours < 42 && template('day', 1)) ||
            (days < 30 && template('days', days)) ||
            (days < 45 && template('month', 1)) ||
            (days < 365 && template('months', days / 30)) ||
            (years < 1.5 && template('year', 1)) ||
            (template('years', years))
        );

        return templates.prefix + string + templates.suffix;
    }

    return {
        ago(sinceTime) {
            return timer(sinceTime);
        },
    };
})();

export default time;
