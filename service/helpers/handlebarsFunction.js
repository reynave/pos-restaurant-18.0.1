// helpers.js
module.exports = (Handlebars) => {
    // Helper center text
    Handlebars.registerHelper("center", function (text, width) {
        if (!text) text = "";
        const len = text.length;
        if (len >= width) return text;
        const leftPadding = Math.floor((width - len) / 2);
        const rightPadding = width - len - leftPadding;
        return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
    });

    // Helper format currency (contoh format Indonesia)
    Handlebars.registerHelper("formatCurrency", function (value) {
        return Number(value).toLocaleString("en-EN");
    });

    // Helper format line kiri-kanan
    Handlebars.registerHelper("formatLine", function (leftText, rightText, width) {
        const left = leftText || "";
        const right = rightText || "";
        const space = width - left.length - right.length;
        return left + " ".repeat(space > 0 ? space : 0) + right;
    });

    // Helper concatenation string
    Handlebars.registerHelper("concat", function (...args) {
        // Hapus argumen terakhir (Handlebars options object)
        return args.slice(0, -1).join("");
    });

    // Helper equals
    Handlebars.registerHelper("eq", function (a, b) {
        return a === b;
    });

    Handlebars.registerHelper('breakEvery50', function (text) {
        if (!text) return '';
        return text.replace(/(.{50})/g, '$1\n');
    });

    // Register 'gt' helper for Handlebars
    Handlebars.registerHelper('gt', function (a, b) {
        return a > b;
    });

    // function repeat
    Handlebars.registerHelper('repeat', function (str, times) {
        return str.repeat(times);
    });
};
