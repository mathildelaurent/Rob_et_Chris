/**
 * PrestaShop module created by VEKIA, a guy from official PrestaShop community ;-)
 *
 * @author    VEKIA https://www.prestashop.com/forums/user/132608-vekia/
 * @copyright 2010-2021 VEKIA
 * @license   This program is not free software and you can't resell and redistribute it
 *
 * CONTACT WITH DEVELOPER
 * support@mypresta.eu
 */

$(document).ready(function () {

    prestashop.on("updatedProduct", function (event) {
        prepareMqc();
    });

    prestashop.on(
        'updateCart',
        function (event) {
            if (typeof event.resp !== 'undefined') {
                if (typeof event.resp.hasError !== 'undefined') {
                    var errors = '';
                    for (error in event.resp.errors) {
                        //IE6 bug fix
                        if (error != 'indexOf')
                            errors += "<span class='mqc_error_line'>" + $('<div>').html(event.resp.errors[error]).text() + "</span>\n";
                    }
                    if (MQC_MODULE_MODAL != 1) {
                        $.fancybox(
                            '<div class="mqc_fancy alert alert-warning">' + errors + '</div>',
                            {
                                'autoScale': false,
                                'autoDimensions': false,
                                'transitionIn': 'elastic',
                                'transitionOut': 'elastic',
                                'speedIn': 600,
                                'speedOut': 200,
                                'width': 400
                            }
                        );
                    }
                }

                if (event.resp.modal) {
                    var showModal = prestashop.blockcart.showModal || function (modal) {
                        var $body = $('body');
                        $body.append(modal);
                        $body.one('click', '#blockcart-modal', function (event) {
                            if (event.target.id === 'blockcart-modal') {
                                $(event.target).remove();
                            }
                        });
                    };
                    showModal(event.resp.modal);
                }
            }
        });
});

function getMqc() {
    return (getIdpaMqc() != 0 ? (product_page_mqc_attributes != null ? ((product_page_mqc_attributes[getIdpaMqc()] != false && product_page_mqc_attributes[getIdpaMqc()] != null) ? product_page_mqc_attributes[getIdpaMqc()] : (+product_page_mqc > 0 ? product_page_mqc : 1)) : product_page_mqc) : product_page_mqc)
}

function getIdpaMqc() {
    if ($('.quickview').length != 0) {
        if (typeof id_product_attribute_minqc !== 'undefined') {
            return id_product_attribute_minqc;
        }
    }

    var id_product_attribute = 0;
    if ($('#product-details').length != 0) {
        attr = $('#product-details').attr('data-product');
        if (typeof attr !== typeof undefined && attr !== false) {
            var product_object = $.parseJSON(attr);
            var id_product_attribute = product_object.id_product_attribute;
        }
    } else if ($('#product-details-mqc').length != 0) {
        attr = $('#product-details-mqc').attr('data-product');
        if (typeof attr !== typeof undefined && attr !== false) {
            var product_object = $.parseJSON(attr);
            var id_product_attribute = product_object.id_product_attribute;
        }
    }
    return id_product_attribute;
}

function prepareMqc() {
    if (typeof product_page_mqc !== 'undefined' || typeof product_page_mqc_attributes !== 'undefined') {
        if (getMqc() != 0) {
            $('#quantity_wanted').trigger("touchspin.updatesettings", {max: getMqc()});
        }
    }
}