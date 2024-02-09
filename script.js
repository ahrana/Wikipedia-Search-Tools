<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r124/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"></script>
<script>
  var search = document.getElementById('search');
  var output = document.getElementById('output');
  var saveToExcelBtn = document.getElementById('saveToExcel');
  var developerCreditBtn = document.getElementById('developerCredit');
  var popupContainer = document.getElementById('popupContainer');

  var placeholderText = "Search on Wikipedia";
  var placeholderIndex = 0;
  var typingSpeed = 100; // Adjust typing speed (milliseconds per character)

  function typePlaceholder() {
    if (placeholderIndex < placeholderText.length) {
      search.setAttribute('placeholder', placeholderText.substring(0, placeholderIndex + 1));
      placeholderIndex++;
      setTimeout(typePlaceholder, typingSpeed);
    } else {
      search.classList.remove('typing');
    }
  }

  search.addEventListener('focus', function(){
    search.classList.add('typing');
    typePlaceholder();
  });

  search.addEventListener('blur', function(){
    search.classList.remove('typing');
    placeholderIndex = 0;
  });

  search.addEventListener('input', function(){
    // removing old script tags
    var jsonpUrl = document.getElementById('jsonpUrl');
    if (jsonpUrl !== null) {
      document.body.removeChild(jsonpUrl);
    }

    var query = search.value.trim(); // Trim whitespace

    if (query === '') {
      output.style.display = 'none'; // Hide search results if query is empty
      return;
    }

    var limit = document.querySelector('input[name="searchLimit"]:checked').value;

    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
              encodeURI(query) +
              "&limit=" + limit + "&callback=myJsonpCallback&id=123";

    var scriptEl = document.createElement('script');
    scriptEl.setAttribute('id', 'jsonpUrl');
    scriptEl.setAttribute('src', url);
    document.body.appendChild(scriptEl);
  });

  window.myJsonpCallback = function(data) {
    output.innerHTML = "";

    for (var i = 0; i < data[1].length; i++) {
      var a = document.createElement('a');
      a.setAttribute('href', data[3][i]);
      a.setAttribute('target', '_blank');
      a.innerHTML = data[1][i];

      output.appendChild(a);
    }

    output.style.display = 'block'; // Show search results
    setTimeout(function() {
      output.querySelectorAll('a').forEach(function(link) {
        link.classList.add('show'); // Add 'show' class for animation
      });
    }, 100);
  };

  document.addEventListener('click', function(event){
    if(event.target !== output && event.target !== search) {
      output.style.display = 'none'; // Hide search results if clicked outside
    }
  });

  saveToExcelBtn.addEventListener('click', function() {
    var data = [['Wikipedia Search Tools By Anowar']];
    var links = document.querySelectorAll('#output a');
    links.forEach(function(link) {
      data.push([link.textContent, link.href]);
    });

    var ws = XLSX.utils.aoa_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Search Results');
    XLSX.writeFile(wb, 'search_results.xlsx');
  });

  developerCreditBtn.addEventListener('click', function() {
    popupContainer.style.display = 'flex';
  });

  document.getElementById('closePopup').addEventListener('click', function() {
    popupContainer.style.display = 'none';
  });
  
</script>
