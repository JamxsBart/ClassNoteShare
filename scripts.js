document.addEventListener('DOMContentLoaded', function() {
    const saveOptions = document.getElementById('Saveoptions');
    const privacyDropdown = document.getElementById('PrivacyOptions');
    
    console.log('Script loaded', saveOptions, privacyDropdown);
    
    saveOptions.addEventListener('change', function(e) {
      const action = this.value;
      console.log('Selected:', action);
      
      if (action === 'save') {
        const filename = prompt('Enter filename:');
        if (filename) {
          console.log('Saving as:', filename);
        }
      } 
      else if (action === 'share') {
        const shareUrl = window.location.href;
        prompt('Share this URL:', shareUrl);
      } 
      else if (action === 'privacy') {
        console.log('Showing privacy dropdown');
        privacyDropdown.style.display = 'inline-block';
      }
      
      this.value = '';
    });
    
    privacyDropdown.addEventListener('change', function() {
      const privacySetting = this.value;
      console.log('Privacy set to:', privacySetting);
      alert('Privacy set to ' + privacySetting);
      
      this.value = '';
      this.style.display = 'none';
    });
  });