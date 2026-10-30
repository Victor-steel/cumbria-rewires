(function () {
  var form = document.querySelector('[data-service-form]');
  if (!form) return;
  var result = form.querySelector('.service-send');
  function invalidate() { result.hidden = true; }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var fields = ['name', 'phone', 'postcode', 'message'];
    var empty = fields.find(function (key) { return !form.elements[key].value.trim(); });
    if (empty) {
      form.elements[empty].setCustomValidity('Please complete this field.');
      form.elements[empty].reportValidity();
      form.elements[empty].addEventListener('input', function () { this.setCustomValidity(''); }, {once:true});
      return;
    }
    var service = form.elements.service.value;
    var body = [
      'Hi Finn, I would like to enquire about ' + service + '.', '',
      'Name: ' + form.elements.name.value.trim(),
      'Phone: ' + form.elements.phone.value.trim(),
      'Location: ' + form.elements.postcode.value.trim(), '',
      'Job details:', form.elements.message.value.trim()
    ].join('\n');
    form.querySelector('[data-send-email]').href = 'mailto:finngraham87@gmail.com?subject=' + encodeURIComponent('FG Electrical enquiry: ' + service) + '&body=' + encodeURIComponent(body);
    form.querySelector('[data-send-wa]').href = 'https://wa.me/447495333990?text=' + encodeURIComponent(body);

    // Asynchronously submit lead to Netlify Forms
    try {
      var formData = new URLSearchParams();
      formData.append('form-name', 'service-enquiry');
      formData.append('service', service);
      formData.append('name', form.elements.name.value.trim());
      formData.append('phone', form.elements.phone.value.trim());
      formData.append('postcode', form.elements.postcode.value.trim());
      formData.append('message', form.elements.message.value.trim());
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      }).catch(function (err) {
        console.warn('Netlify service form error:', err);
      });
    } catch (e) {}

    form.querySelector('#form-status').textContent = 'Your enquiry is ready. Open email or WhatsApp below, then press send in your app.';
    result.hidden = false;
    form.querySelector('[data-send-email]').focus();
  });
})();
