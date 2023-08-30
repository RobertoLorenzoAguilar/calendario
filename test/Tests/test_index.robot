
*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Library    XML
Suite Setup      Open Browser Without Login
# Suite Teardown   Close Browser

*** Variables ***
${BASE_DIR}    ${CURDIR}/../../    # Ruta base relativa

*** Settings ***
Resource   ${CURDIR}/../Variables/MyVariables.robot

*** Keywords ***
Open Browser Without Login
    ${archivo}    Set Variable    index.html
    ${ruta_completa}    Join Path    ${BASE_DIR}    ${archivo}
    Open Browser    ${ruta_completa}    Chrome
    Wait Until Page Contains Element    class=calendar

Close Browser
    [Teardown]    Run Keyword If Test Failed    Capture Page Screenshot
    Close All Browsers

*** Test Cases ***
Abrir y verificar la página de inicio   
    Wait Until Page Contains Element    ${CALENDAR}    # verifica que exista el encabezado
    Wait Until Page Contains Element    ${EncabezadoMes}  # verifica que exista el encabezado
    Wait Until Page Contains Element    ${txtFechaInicio}  # verifica que exista el campo inicio
    Wait Until Page Contains Element    ${txtDiasMostrar}   # verifica que exista el dias mostrar
    Wait Until Page Contains Element    ${tbl_dias}  # verifica que exista tabla
    Wait Until Page Contains Element    ${days}      # verifica que existan los dias

Verificar Alertado con Formato Datos Erroneo En FechaInicio    
    Wait Until Page Contains Element    ${CALENDAR}      
    Input Text      ${txtFechaInicio}   2023-45-56
    Wait Until Page Contains Element    ${btnCalendar}  
    Click Button    ${btnCalendar}          
    Wait Until Element Is Visible    ${alertModal}     1s        
    Click Button    ${btnOokalertModal} 
    Input Text      ${txtFechaInicio}   2023-02-01    
    Wait Until Element Is Not Visible    ${alertModal}    1s     
    Click Button    ${btnCalendar}         
    
        
Verificar Alertado con Dias Mayor Mes Erroneo En FechaInicio        
    Wait Until Page Contains Element    ${CALENDAR}      
    Input Text      ${txtDiasMostrar}    40
    Wait Until Page Contains Element    ${btnCalendar}  
    Click Button    ${btnCalendar}      
    Wait Until Element Is Visible    ${alertModal}     1s     
    Click Button    ${btnOokalertModal} 
    Input Text       ${txtDiasMostrar}    10
    Wait Until Element Is Not Visible   ${alertModal}     1s     
    Click Button    id=btnCalendar        

Verificar Dia Festivo Cinco Febrero        
    ${textoSeteadoEncabezado}    Get Text    ${EncabezadoMes}    
    Should Be Equal As Strings    Febrero    ${textoSeteadoEncabezado}    
    Wait Until Page Contains Element    class=${festivoNaranja}     timeout=10s
    ${Dia}    Get Text    class=${festivoNaranja}      
    Should Be Equal    ${Dia}     5  
    