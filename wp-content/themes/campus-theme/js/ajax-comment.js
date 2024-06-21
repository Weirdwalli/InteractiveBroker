jQuery(document).ready(function() {
    jQuery('#commentform').on('submit', function(e) {
        e.preventDefault();

        var form = jQuery(this);
        var formData = form.serializeArray();
        formData.push({ name: 'nonce', value: ajax_comment_params.nonce });
        formData.push({ name: 'action', value: ajax_comment_params.action }); // Add action parameter

        // Show the "Submitting" status message
        form.after('<p id="comment-status">Submitting...</p>');
        form.hide();
		//jQuery('.reply').remove();
		//jQuery('#cancel-comment-reply-link').remove();
		jQuery('#cancel-comment-reply-link').hide();

        console.log('Form Data:', formData); // Log the form data for debugging

        jQuery.ajax({
            type: 'POST',
            url: ajax_comment_params.ajax_url,
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    var newComment = jQuery(response.data.comment_html);
                    if (form.find('#comment_parent').val() != '0') {
                        jQuery('#comment-' + form.find('#comment_parent').val()).append(newComment);
                    } else {
                        jQuery('#comment-list').append(newComment);
                    }
                    form.find('textarea').val('');
                    form.find('#comment_parent').val('0');
                    jQuery('#comment-status').remove(); // Remove the status message
                    //jQuery('#cancel-comment-reply-link').hide();
					//jQuery('#respond').remove();
        			form.show();
					jQuery('#cancel-comment-reply-link').show();
					document.getElementById('cancel-comment-reply-link').click();
                } else {
                    alert('Error: ' + response.data);
                    console.log('Server Response:', response); // Log server response
                    jQuery('#comment-status').remove(); // Remove the status message
                    form.show(); // Show the form again
                }
            },
            error: function(xhr, status, error) {
                console.log('AJAX Error:', xhr.responseText); // Log the full response
                alert('An error occurred while submitting your comment. Please try again.');
                jQuery('#comment-status').remove(); // Remove the status message
                form.show(); // Show the form again
            }
        });
    });
});
