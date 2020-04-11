import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useTable, usePagination} from 'react-table';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ReadMoreReact from 'read-more-react';
import Autosuggest from 'react-autosuggest';

const usePanelSummaryStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  root: {
    backgroundColor: '#201aa220',
    height: '4rem',
  },
}));

const usePanelStyles = makeStyles((theme) => ({
  root: {
    width: 'calc(100%-0.2rem)',
    marginBottom: '0.2rem',
  },
}));

// const useItemTextStyles = makeStyles((theme) => ({
//   primary: {
//     fontFamily: 'Archia',
//     fontWeight: 500,
//     fontStyle: 'normal',
//     fontSize: '13px',
//     fontTransform: 'uppercase',
//   },
//   secondary: {
//     fontFamily: 'Archia',
//     fontWeight: 400,
//     fontStyle: 'normal',
//     fontSize: '12px',
//     // fontTransform: 'uppercase'
//   },
// }));

// const getFormattedLink = (initialValue) => {
//   const reurl1 = /\s*(https?:\/\/.+)\s*/g;
//   // let reurl2 = /\s*.*(www\..+)\s*/g
//   const reinsta = /\s*Instagram: @(.+)\s*/g;
//   const refb = /\s*Facebook: @(.+)\s*/g;
//   const s1 = initialValue.replace(reurl1, '<a href="$1">Link</a>');
//   const s2 = s1.replace(
//     reinsta,
//     '<a href="https://www.instagram.com/$1">Instagram: @$1</a>'
//   );
//   const s3 = s2.replace(
//     refb,
//     '<a href="https://www.facebook.com/$1">Facebook: @$1</a>'
//   );
//   return (
//     <div
//       className="tablecelldata"
//       dangerouslySetInnerHTML={{
//         __html: s3,
//       }}
//     ></div>
//   );
// };

// var formattedListOnMobileView = (row) => {
//   return (
//     <div className="mobileTable tablecelldata">
//       <h3>Organization Name</h3>
//         <a href={row.values['contact']}>
//           {row.values['nameoftheorganisation']}
//         </a>
//       <h3>Phone</h3>
//         <a href={`tel:${row.values['phonenumber']}`}>
//           {row.values['phonenumber']}
//         </a>
//       <h3>Description</h3>
//       <ReadMoreReact
//           text={row.values['descriptionandorserviceprovided']}
//           readMoreText={'Read More...'}
//         />
//     </div>
//   );
// };

const FormattedCell = ({value: initialValue, editable}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const reurl1 = /\s*(https?:\/\/.+)\s*/g;
  // let reurl2 = /\s*.*(www\..+)\s*/g
  const reinsta = /\s*Instagram: @(.+)\s*/g;
  const refb = /\s*Facebook: @(.+)\s*/g;

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    const s1 = initialValue.replace(reurl1, '<a href="$1">Link</a>');
    const s2 = s1.replace(
      reinsta,
      '<a href="https://www.instagram.com/$1">Instagram: @$1</a>'
    );
    const s3 = s2.replace(
      refb,
      '<a href="https://www.facebook.com/$1">Facebook: @$1</a>'
    );
    // let s4 = s3.replace(reurl2, '<a href="http://$1">Link</a>');
    setValue(s3);
  }, [initialValue, reurl1, refb, reinsta]);

  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></div>
  );
};

// searchbar stuff

const getSuggestions = (value, resources) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  // console.log(resources);
  return inputLength === 0
    ? resources
    : resources.filter(
        (resource) =>
          resource.category.toLowerCase().includes(inputValue.toLowerCase()) ||
          resource.descriptionandorserviceprovided
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          resource.nameoftheorganisation
            .toLowerCase()
            .includes(inputValue.toLowerCase())
      );
};

const getSuggestionValue = (suggestion) => suggestion.nameoftheorganisation;

const renderSuggestion = (suggestion) => (
  <div>{suggestion.nameoftheorganisation}</div>
);

function ResourceTable({columns, data, isDesktop}) {
  const classesPannelSummary = usePanelSummaryStyles();
  const classesPanel = usePanelStyles();
  // const classesListItemText = useItemTextStyles();
  const defaultColumn = React.useMemo(
    () => ({
      Cell: FormattedCell,
    }),
    []
  );

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState(data);

  useEffect(() => {
    setSuggestions(data);
    setSearchValue('');
  }, [data]);

  const onChange = (event, {newValue}) => {
    setSearchValue(newValue);
  };

  const onSuggestionsFetchRequested = ({value}) => {
    setSuggestions(getSuggestions(value, data));
  };

  const inputProps = {
    placeholder: 'Search for keyword',
    value: searchValue,
    onChange: onChange,
  };

  // const formatDesktopTable = (data) => {
  //   console.log(suggestions);
  //   console.log(columns);
  //   return data;
  // }

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data: suggestions,
      defaultColumn,
      initialState: {pageIndex: 0, pageSize: 5},
    },
    usePagination
  );

  // Render the UI for your table
  if (isDesktop === true)
    return (
      <>
        <div className="searchbar">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={true}
          />
        </div>
        <div className="tableandcontrols">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render('Cell', {editable: false})}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <div className="paginationbutton">
              <button
                className="button is-purple"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {'\u003c\u003c'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {'>'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </button>{' '}
            </div>
            <h5 style={{color: '#201aa299'}}>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </h5>
            {/* <h5 style={{marginLeft:'0.2rem'}}>
                     Go to page:{' '}
                </h5> */}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />

            <select
              className="select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="searchbar">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            // highlightFirstSuggestion={true}
            // onSuggestionSelected = {this.props.onSuggestionSelected}
          />
        </div>
        <div className="resourcesaccordion">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <ExpansionPanel key={row.id} classes={{root: classesPanel.root}}>
                <ExpansionPanelSummary
                  classes={{
                    content: classesPannelSummary.content,
                    root: classesPannelSummary.root,
                  }}
                >
                  {/* <div className="expanelheading"
                                 style={{display: 'flex',
                                         flexDirection: 'row',
                                         justifyContent: 'space-between',
                                         backgroundColor: 'blue'}}> */}
                  <div
                    className="orgname"
                    style={{
                      maxWidth: '10rem',
                      textAlign: 'start',
                      color: '#201aa2dd',
                    }}
                  >
                    <h6>{row.values['nameoftheorganisation']}</h6>
                  </div>
                  <div
                    className="orgcategory"
                    style={{maxWidth: '10.9rem', textAlign: 'end'}}
                  >
                    <h6>{row.values['category']}</h6>
                  </div>
                  {/* </div> */}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List disablePadding={true} dense={true}>
                    <div className="mobileTable tablecelldata">
                      <h3>Organization Name</h3>
                      <a href={row.values['contact']}>
                        {row.values['nameoftheorganisation']}
                      </a>
                      <h3>Phone</h3>
                      <p>{row.values['phonenumber']}</p>
                      <h3>Description</h3>
                      <p>{row.values['descriptionandorserviceprovided']}</p>
                    </div>
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
          <div className="pagination">
            <div className="paginationbutton">
              <button
                className="button is-purple"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {'\u003c\u003c'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {'>'}
              </button>{' '}
              <button
                className="button is-purple"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </button>{' '}
            </div>
            <h5 style={{color: '#201aa299'}}>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </h5>
            {/* <h5 style={{marginLeft:'0.2rem'}}>
                     Go to page:{' '}
                </h5> */}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />

            <select
              className="select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    );
}

export default ResourceTable;
