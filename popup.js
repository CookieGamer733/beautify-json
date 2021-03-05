document.body.onload = async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    function: beautifyJSON,
  });
  window.close();
};
function beautifyJSON() {
  function syntaxHighlight(json) {
    if (!((jsonString) => {
      try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
          return true;
        }
      }
      catch (e) {
        return false;
      }
    })(json)) return alert("Page content is not valid JSON");
    if (!document.getElementsByTagName("head")[0]) {
      document.appendChild(document.createElement("body")).innerHTML = document.innerHTML;
      document.appendChild(document.createElement("head"))
    }
    document.getElementsByTagName("head")[0].innerHTML = `<style>body {background-color:black;}pre {outline: none;color: #D4D4D4;padding: 5px;margin: 5px;background-color: black;}.string {color: #CE723B;}.number {color: #B5C077;}.boolean {color: #569CD6;}.null {color: #569CD6;}.key {color: #9CCDC4;}</style><script>function syntaxHighlight(json) {json = JSON.stringify(json, undefined, 2);json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');inp = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {var cls = 'number';if (/^"/.test(match)) {if (/:$/.test(match)) {cls = 'key';} else {cls = 'string';}} else if (/true|false/.test(match)) {cls = 'boolean';} else if (/null/.test(match)) {cls = 'null';}return '<span class="' + cls + '">' + (match.endsWith(":") ? match.slice(0, -1) : match) + '</span>' + (match.endsWith(":") ? ":" : "");});document.body.appendChild(document.createElement('pre')).innerHTML = inp;}</script>`;
    json = JSON.stringify(JSON.parse(json), undefined, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    inp = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${(match.endsWith(":") ? match.slice(0, -1) : match)}</span>${(match.endsWith(":") ? ":" : "")}`;
    });
    document.body.innerHTML = `<pre>${inp}</pre>`;
  }
  const code = document.getElementsByTagName("pre")[0];
  if (!code) return alert("No JSON code found.");
  syntaxHighlight(code.innerHTML);
}