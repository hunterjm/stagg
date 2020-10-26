import styled from 'styled-components'

export const AccountBox = styled.div`  
  vertical-align: top;
  text-align: left;
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 320px;
  margin: 8px;
  border: 1px solid #777;
  border-radius: 4px;

  .permissions h6,
  .profiles h6,
  .platforms h6 {
    color: #777;
    font-size: 0.6rem;
    margin: 0;
    padding: 0;
  }

  i.icon-callofduty-c {
    color: #000;
  }

  .action {
    opacity: 1;
    transition: opacity 0.1s ease;
    position: absolute;
    top: 8px; right: 8px;
    border: 1px solid;
    border-radius: 4px;
    font-size: 0.6rem;
    padding: 0 8px;
    cursor: pointer;
  }

  :hover {
    .action {
      opacity: 1;
    }
  }

  .action.add {
    border-color: #6163FF;
    color: #6163FF;
  }
  .action.add:after {
    content: "Authorize";
  }

  .action.remove {
    border-color: #22B14C;
    color: #22B14C;
    cursor: default;
  }

  .action.remove:after {
    content: "Looks good";
  }

  .action.loading {
    border-color: blue;
    color: blue;
  }

  .action.loading:after {
    content: "Working";
  }

  .branding {
    padding: 8px 12px 0;
    * {
      margin: 0;
      padding: 0;
      display: inline-block;
    }
    i {
      position: relative;
      bottom: -5px;
      margin-right: 12px;
    }
  }

  .profiles, .platforms {
    font-size: 0.7rem;
    h6 {
      padding-left: 6px;
    }
    padding: 0 6px 12px;
    i {
      color: #fff;
      margin: 6px;
      font-size: 1rem;
    }
  }

  .platforms i {
    position: relative;
    bottom: -4px;
  }

  .profiles img.icon {
    position: relative;
    margin: 0 4px 0 8px;
    bottom: -8px;
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
  }

  .permissions {
    padding: 4px 12px 4px;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.625rem;

      li {
        margin: -8px 0 0 0;
        padding: 0;
        list-style: none;

        i.icon-discord-check {
          color: #22B14C;
          font-size: 0.7rem;
          position: relative;
          bottom: -2px;
          margin-right: 4px;
        }
      }
    }
  }
`
