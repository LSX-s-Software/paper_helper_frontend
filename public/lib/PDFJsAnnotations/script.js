const myIframe = window.parent.document.querySelector('#pdf');

var pdf = new PDFAnnotate('pdf-container', myIframe.dataset.url, {
  onPageUpdated(page, oldData, newData) {
    // console.log(page, oldData, newData);
    myIframe.dispatchEvent(new Event('pageUpdate'));
  },
  ready() {
    loadData();
  },
  scale: 1.5,
  pageImageCompression: 'MEDIUM', // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
});

function loadData() {
  $.get(
    {
      url: myIframe.dataset.annotationurl,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      async: false,
    },
    function (data) {
      pdf.loadFromJSON(JSON.parse(data.content));
      myIframe.dispatchEvent(new Event('ready'));
    }
  );
}

function changeActiveTool(event) {
  var element = $(event.target).hasClass('tool-button')
    ? $(event.target)
    : $(event.target).parents('.tool-button').first();
  $('.tool-button.active').removeClass('active');
  $(element).addClass('active');
  $('#font-size-container').hide();
  $('#brush-size-container').hide();
  $('#color-container').hide();
}

function enableSelector(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enableSelector();
}

function enablePencil(event) {
  event.preventDefault();
  changeActiveTool(event);
  $('#brush-size-container').show();
  $('#color-container').show();
  pdf.enablePencil();
}

function enableAddText(event) {
  event.preventDefault();
  changeActiveTool(event);
  $('#font-size-container').show();
  $('#color-container').show();
  pdf.enableAddText();
}

function enableAddArrow(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enableAddArrow(function () {
    $('.tool-button').first().find('i').click();
  });
}

function addImage(event) {
  event.preventDefault();
  pdf.addImageToCanvas();
}

function enableRectangle(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.setColor('rgba(255, 0, 0, 0.3)');
  pdf.setBorderColor('blue');
  pdf.enableRectangle();
}

function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

function savePDF() {
  myIframe.dispatchEvent(new Event('save'));
}

function downloadPDF() {
  pdf.savePdf('output.pdf');
}

function clearPage() {
  pdf.clearActivePage();
}

function getPDFData() {
  return new Promise((resolve) => {
    pdf.serializePdf((string) => {
      resolve(string);
    });
  });
}

$(function () {
  $('.color-tool').click(function () {
    $('.color-tool.active').removeClass('active');
    $(this).addClass('active');
    color = $(this).get(0).style.backgroundColor;
    pdf.setColor(color);
  });

  $('#brush-size').change(function () {
    var width = $(this).val();
    pdf.setBrushSize(width);
  });

  $('#font-size').change(function () {
    var font_size = $(this).val();
    pdf.setFontSize(font_size);
  });
});
