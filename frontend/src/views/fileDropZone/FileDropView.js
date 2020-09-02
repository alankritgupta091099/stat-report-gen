import React,{ useState } from 'react';
import { Box, Container, Card, CardContent, Typography , Grid , List , ListItem , ListItemText , Button , Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { OutTable , ExcelRenderer } from 'react-excel-renderer';

import Page from 'src/components/Page';

const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}

const DropBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

function FileDropView (props) {

  const { acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragReject, isDragActive } = useDropzone({
    accept:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, text/csv',
    multiple:false,
    noKeyboard:true
  });
  
  const [table, setTable] = useState(null)

  const files = acceptedFiles.map(file =>{
    ExcelRenderer(file, (err, resp) => {
      if(err){
        console.log(err);            
      }
      else{
        const {rows , cols} = resp;
        console.log(resp)
        if( cols.length == 1 && rows[0] == 'Links' ){
          setTable(resp)
        } else {
          //add error section
        }        
      }
    });  

    return( 
    <p key={file.path}>
        {file.path} - {file.size} bytes
    </p>
    )
  });

  return (
    <Page>
      <Container>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h1">Generate your report</Typography>
              <div>
                <DropBox {...getRootProps({isDragActive, isDragAccept, isDragReject})}>{/* Later add Hover styling and others as well */}
                  <input {...getInputProps()} />
                  <h3>Drag 'n' drop some files here, or click on this section to upload files</h3><br/>
                  <h4>Accepted formats xlsx, xls, csv, odf</h4>
                </DropBox>
              </div>
              <br/>
              <br/>
              <Grid container>
                <Grid item xs={6}>
                  {
                    table ? <>
                    <Typography variant="h2">Selected File: 
                      <Typography variant="subtitle1" color="textSecondary">{files}</Typography>
                    </Typography>
                    <br/>
                    <Button variant="contained" color="primary" disableElevation>
                      Generate Report
                    </Button>
                    </> : ""
                  }
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h2">
                    Instructions
                  </Typography >
                  <Typography variant="h5">
                    <List>
                      <ListItem>
                        <ListItemText
                          primary='1. Drag n drop the file in the section or click on the section to upload the file'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary='2. Make sure that the file has single column only and value of Row 1 "Links"'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary='3. Click on "Generate" button'
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary='Note: Make sure that file is only of formats xlsx, xls, csv, odf'/>
                      </ListItem>
                    </List>
                  </Typography>
                </Grid>
              </Grid>                            
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
  
}

export default FileDropView;
