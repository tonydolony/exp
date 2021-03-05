$(function() {
   'use strict';
    const baseTableHeaders = ['Product', 'Option', 'Attribute', 'Revenue Type', 'QTY', 'Unit Price', 'Start Month', 'Months', 'Revenue Recognition', 'Commited'];
    const tableExtraData = $('.table-extra-data').html();

    let baseMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let rebuildBaseMonths = [];
    let pullBiggestLineDataIndex = 0;
    let pullBiggestLineData = 0;

    _init();

    function _init() {
        let isInit = true;
        baseTableHeaders.forEach((item) => {
            $('.table-base thead tr').append(`<th scope="col">${item}</th>`);
        });

        lineItemData.forEach((row) => {
            $('.table-base tbody').append(`<tr>
							<td>${row.productItemName || '-'}</td>
							<td>${row.optionItemName || '-'}</td>
							<td>${row.attributes || '-'}</td>
							<td>${row.revenueType || '-'}</td>
							<td>${row.qty || '-'}</td>
							<td>${row.unitPrice || '-'}</td>
							<td>${row.startMonth || '-'}</td>
							<td>${row.months || '-'}</td>
							<td>${row.revenueRecognitionName || '-'}</td>
							<td>${row.committed || '-'}</td>
						</tr>`);
        });

        //Add summary at the end
        $('.table-base tbody').append(`<tr class="summary"><td colspan=${baseTableHeaders.length}>&nbsp;</td></tr>`)
        generateYearTable(isInit);
    }

    /**
     *
     * @init {Boolean} check if it's initial invoke to call addStickyEffect
     */
    function generateYearTable(init) {
        const years = summaryYears?.responseData?.yearsData;

        if (years && years.length) {
                let pullBiggestLineData = 0;
                years.forEach((item) => {
                    item.lineData.length > pullBiggestLineData ? pullBiggestLineData = item.lineData.length : null;
                });

                years.forEach((item, index) => {
                $('.table-extra-data thead tr').append(`<th scope="col">${item.year}</th>`);
                $('.table-extra-data tbody').append(`<tr class=${index}></tr>`);

                for (var i = 0; i < pullBiggestLineData - item.lineData.length; i++) {
                    item.lineData.push({amount: '-'})
                }

                item.lineData.forEach((itemChild) => {
                    $(`.table-extra-data tbody tr.${index}`).append(`
							<td>${itemChild.amount}</td>
						`);
                });

                //Add summary at the end
                if (index+1 === years.length) {
                    $('.table-extra-data tbody').append(`<tr class=${index+1}></tr>`);
                    years.forEach((itemChild) => {
                        $(`.table-extra-data tbody tr.${index+1}`).append(`
							<td>${itemChild.summaryAmount ? itemChild.summaryAmount : '-'}</td>
						`);
                    });
                }
            });
        }
        if (init) { addStickyEffect() }
    }

    function generateMonthTable() {
        const months = summaryMonths?.responseData?.linesData;

        if (months && months.length) {
            rebuildBaseMonths = [...baseMonths];
            months.forEach((item, index) => {
                pullBigest(item.data, index)
            });

            // Generate header
            rebuildBaseMonths.splice(0, months[pullBiggestLineDataIndex].startMonth);
            if (rebuildBaseMonths.length < months[pullBiggestLineDataIndex].data.length) {
                concatArrays(months[pullBiggestLineDataIndex].data, months[pullBiggestLineDataIndex].startYear)
            }
            rebuildBaseMonths.forEach((data) => {
                $('.table-extra-data thead tr').append(`<th scope="col">${data}</th>`);
            });

            months.forEach((item, index) => {
                $('.table-extra-data tbody').append(`<tr class=${index}></tr>`);
                let addionalRows = pullBiggestLineData - item.data.length;

                 for(var i = 0; i < addionalRows; i++) {
                    item.data.push('-');
                }

                item.data.forEach((itemChild) => {
                    $(`.table-extra-data tbody tr.${index}`).append(`
                        <td>${itemChild}</td>
                    `);
                });

                //Add summary at the end
                if (index+1 === months.length) {
                    $('.table-extra-data tbody').append(`<tr class=${index+1}></tr>`);
                    summaryMonths.responseData.summaryAmount.forEach((itemChild) => {
                        $(`.table-extra-data tbody tr.${index+1}`).append(`
							<td>${itemChild}</td>
						`);
                    });
                }

            })
        }
    }

    /**
     * @dataLength {Array}
     * @startYear {Number}
     */
    function concatArrays(dataLength, startYear) {
        rebuildBaseMonths = rebuildBaseMonths.concat(baseMonths);

        if (rebuildBaseMonths.length < dataLength.length) {
            concatArrays(dataLength, startYear);
        } else {
            rebuildBaseMonths.length = dataLength.length;
            for (var i = 0; i < rebuildBaseMonths.length; i++) {
                if (rebuildBaseMonths[i] === 'Jan') {
                    startYear++;
                }
                rebuildBaseMonths[i] = `${rebuildBaseMonths[i]} ${startYear}`;
            }
        }
    }

    /**
     * @value {Array}
     * @index {Number}
     */
    function pullBigest(value, index) {
        if (pullBiggestLineData < value.length) {
            pullBiggestLineData = value.length;
            pullBiggestLineDataIndex = index;
        }
    }

    function addStickyEffect() {
        $('.table-base tbody tr td:first-child').each((i, item) => {
            if (!$(item).parent().hasClass('summary')) {
                let getWidth = $(item).outerWidth() + 'px';
                let getHeight = $(item).outerHeight() + 'px';

                $(item).addClass('position-relative')
                $(item).prepend($(item).clone().addClass('position-fixed exp-sticky d-none').css('width', getWidth, 'height', getHeight))
            }
        });
    }

    function clearExtraTable() {
        $('.table-extra-data').html(tableExtraData)
    }

    //Action triggers
    $('.dropdown-holder').hover(()=> {
        $('.dropdown-menu').addClass('show');
    }, ()=> {
        $('.dropdown-menu').removeClass('show');
    });

    $('.dropdown-item:last-child').click(() => {
        $('.dropdown-item i').toggleClass('d-none');
        clearExtraTable();
        if ($('.dropdown-item i').hasClass('d-none')) {
            generateYearTable();
        } else {
            generateMonthTable();
        }

        let width = $('.table-base').outerWidth();
        $('.content').scrollLeft(width);
    });

    $(window).scroll(function () {
        if ($(window).scrollTop()) {
            $('.exp-sticky').removeClass('d-none');
        } else {
            $('.exp-sticky').addClass('d-none');
        }
    });
});



