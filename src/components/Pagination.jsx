import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Form} from "react-bootstrap";
import ReactPaginate from "react-paginate";

export const Pagination = (props) => {
  const {
    meta: {
      from, to, total, per_page: perPage, last_page: lastPage, current_page: currentPage,
    },
  } = props

  const [pageIndex, setPageIndex] = useState(currentPage - 1)
  const router = useRouter()

  useEffect(() => {
    setPageIndex(currentPage - 1)
  }, [currentPage])

  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-12 text-center text-sm-start col-sm-auto col-lg mb-3">
        Showing
        {' '}
        <span className="fw-semibold">{from}</span>
        {' '}
        to
        {' '}
        <span className="fw-semibold">{to}</span>
        {' '}
        of
        {' '}
        <span className="fw-semibold">{total}</span>
        {' '}
        results
      </div>
      <div className="col-auto ms-sm-auto mb-3">
        Rows per page:
        {' '}
        <Form.Select
          value={perPage}
          className="d-inline-block w-auto"
          aria-label="Item per page"
          onChange={(event) => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                page: 1, // Go back to first page
                per_page: event.target.value,
              },
            })
          }}
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
        </Form.Select>
      </div>
      <div className="col-auto ms-sm-auto mb-3 overflow-auto">
        <ReactPaginate
          forcePage={pageIndex}
          pageCount={lastPage}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          containerClassName="pagination mb-0"
          previousClassName="page-item"
          pageClassName="page-item"
          breakClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          nextLinkClassName="page-link"
          previousLabel="‹"
          nextLabel="›"
          activeClassName="active"
          disabledClassName="disabled"
          onPageChange={(selectedItem) => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                page: selectedItem.selected + 1,
              },
            })
          }}
        />
      </div>
    </div>
  )
}
