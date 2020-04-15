import React from 'react';
export const getNumbersLink = (initialValue) => {
  // const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const numbf = initialValue.split(',');
  // console.log('numbers are', '' + numbf.length);

  const numbg = /^\d{5,12}$/g;
  const numberList = numbf.map((iv, i) => {
    iv = iv.trim();
    // console.log('numbr ', '' + iv);
    return iv.replace(numbg, '<a href="tel:$&">$&</a>');
  });
  // console.log('numberList ', '' + numberList);
  return {numberList};
};
export const getFormattedLinkForAccordion = (initialValue) => {
  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: getFormattedLink(initialValue),
      }}
    ></div>
  );
};

export const getFormattedLink = (initialValue) => {
  const reurl1 = /\s*(https?:\/\/.+)\s*/g;
  // let reurl2 = /\s*.(www\..+)\s/g
  const reinsta = /\s*Instagram: @(.+)\s*/g;
  const refb = /\s*Facebook: @(.+)\s*/g;
  const noLetters = /^[\d,\s]+$/;
  let s3 = '';
  if (initialValue.match(noLetters) != null) {
    const formatedLink = getNumbersLink(initialValue);
    const links = JSON.parse(JSON.stringify(formatedLink));
    // console.log('success val', ' --' + JSON.stringify(links.numberList));
    s3 = String(links.numberList).replace(/,/g, '<br>');
  } else {
    const s1 = initialValue.replace(
      reurl1,
      '<a href="$1" target="_blank">Link</a>'
    );
    const s2 = s1.replace(
      reinsta,
      '<a href="https://www.instagram.com/$1" target="_blank">Instagram: @$1</a>'
    );
    s3 = s2.replace(
      refb,
      '<a href="https://www.facebook.com/$1" target="_blank">Facebook: @$1</a>'
    );
  }
  return s3;
};

const customJoinHighlight = (list, joinVals) => {
  let result = '';
  for (let i = 0; i < list.length - 1; i++) {
    result +=
      list[i] +
      '<span style="background-color: yellow">' +
      joinVals[i] +
      '</span>';
  }
  result += list[i];
  // console.log(result);
  return result;
};

const customJoinHighlightMobile = (list, joinVals) => {
  const result = [];
  for (let i = 0; i < list.length - 1; i++) {
    result.push(<span key={i}>{list[i]}</span>);
    result.push(<span style={{backgroundColor: 'yellow'}}>{joinVals[i]}</span>);
  }
  result.push(<span key={i}>{list[i]}</span>);
  // console.log(result);
  return result;
};

export const getHighlightedText = (text, searchValue, type) => {
  // uses searchValue state!!
  if (searchValue === '') {
    return text;
  }

  const regexObject = new RegExp(searchValue, 'gi');

  const parts = text.split(regexObject);
  if (parts.length === 1) {
    return text;
  } else {
    const matches = [...text.matchAll(regexObject)];
    if (type === 'desktop') {
      return customJoinHighlight(parts, matches);
    } else {
      return customJoinHighlightMobile(parts, matches);
    }
  }
};

// export const renderCell = (celli) => {
//   const value = celli.cell.value;
//   // console.log(celli.getHooks());
//   let renderedvalue = '';
//   const link = celli.row.allCells[5].value.split(',')[0];

//   if (celli.column.id === 'contact') renderedvalue = getFormattedLink(getHighlightedText(value));
//   else if (celli.column.id === 'phonenumber') {
//     // renderedvalue = String(JSON.parse(JSON.stringify(getNumbersLink(value))).numberList).replace(/,/g, '<br>');
//     renderedvalue = getFormattedLink(getHighlightedText(value));
//   } else if (celli.column.id === 'nameoftheorganisation') {
//     if (link !== '')
//       renderedvalue = `<a href=${link} target="_blank">${getHighlightedText(value)}</a>`;
//     else renderedvalue = getHighlightedText(value);
//   } else renderedvalue = getHighlightedText(value);

//   return (
//     <div
//       className="tablecelldata"
//       dangerouslySetInnerHTML={{
//         __html: renderedvalue,
//       }}
//     ></div>
//   );
// };

// searchbar stuff

export const getSuggestions = (value, resources) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  // console.log(resources);
  return inputLength === 0
    ? resources
    : resources.filter(
        (resource) =>
          resource.category.toLowerCase().includes(inputValue.toLowerCase()) ||
          resource.city.toLowerCase().includes(inputValue.toLowerCase()) ||
          resource.descriptionandorserviceprovided
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          resource.nameoftheorganisation
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          resource.state.toLowerCase().includes(inputValue.toLowerCase())
      );
};

export const getSuggestionValue = (suggestion) =>
  suggestion.nameoftheorganisation;

export const renderSuggestion = (suggestion) => (
  <div>{suggestion.nameoftheorganisation}</div>
);

export const parseText = function (text, limit) {
  if (text.length > limit) {
    for (let i = limit; i > 0; i--) {
      if (
        text.charAt(i) === ' ' &&
        (text.charAt(i - 1) !== ',' ||
          text.charAt(i - 1) !== '.' ||
          text.charAt(i - 1) !== ';')
      ) {
        return text.substring(0, i) + '...';
      }
    }
    return text.substring(0, limit) + '...';
  } else return text;
};
