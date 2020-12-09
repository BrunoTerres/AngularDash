app.controller('campanhaControlleraPH', function($scope, $http,growl){

    if (!$scope.permissoes[38]){
        window.location = "LOGIN/login.html";
    };

    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    }; 

    $scope.divVisualizar = false;
    $scope.divFormulario = false;
    $scope.divGeral = false;
    $scope.buttonEditar = false;
    $scope.formularioDados = {
        usuario: $scope.login.usuario,
        value: '',
    };
 
    //========== GET INFORMACOES HAVAN ==========//
    $scope.informacoesHavan = function(){
        $http
        ({
            url: $scope.baseApi +'informacoesHavan/',
            method: 'GET',          
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }
        }).then(function(event){
            $scope.transPend.visaoGeral = false;               
            var informacoes = event.data;
            $scope.compradoresHavan = informacoes.compradoresHavan;
            $scope.statusCampanha = informacoes.statusCampanha;                                           
        }).catch(function(err){
            console.log(err);
            $scope.transPend.visaoGeral = false;                    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:98');  
            };               
        });            
    };
    
    $scope.informacoesHavan();

    //========== POST PARA LIBERAR E BLOQUEAR PERMISSAO ==========//
    $scope.pesquisaCampanhaPortalHavan = function (id,value){
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){    
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){              
                $scope.transPend.visaoGeral = true;
                $scope.filtro.value = value;
                $scope.filtro.id = id;
                $http
                ({
                    url: $scope.baseApi +'pesquisaCampanhaPortalHavan/',
                    method: 'POST',
                    data: {'pesquisaCampanhaPortalHavan': $scope.filtro},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }
                }).then(function(event){
                    $scope.transPend.visaoGeral = false; 
                    $scope.divGeral = true;
                    var campanha = event.data;  
                    if(value == 'E'){
                        $scope.formularioDados = campanha.campanhas
                        $scope.formularioDados.terminoCampanha = $scope.convercaoDataParaJS($scope.formularioDados.terminoCampanha); 
                        $scope.formularioDados.inicioCampanha = $scope.convercaoDataParaJS($scope.formularioDados.inicioCampanha); 
                        $scope.formularioDados.fechamento = $scope.convercaoDataParaJS($scope.formularioDados.fechamento); 
                        $scope.formularioDados.data = $scope.convercaoDataParaJS($scope.formularioDados.data);   
                        $scope.formularioDados.usuario = $scope.login.usuario;                     
                        $scope.formularioDados.value = value;                    
                        $scope.divVisualizar = false;
                        $scope.divFormulario = true;
                        $scope.buttonEditar = true;
                        $scope.botaoVolta = true; 
                    }else{
                        if(campanha.error == true){
                            growl.warning('<b>ATENÇÃO!</b><br>Não existe campanha cadastrada!'); 
                            $scope.divVisualizar = false;
                            $scope.divFormulario = true;     
                            $scope.formularioDados.value = 'C'                              
                        }else{                      
                            $scope.campanhas = campanha.campanhas;
                            $scope.divVisualizar = true;
                            $scope.divFormulario = false;
                        };  
                    };                                             
                }).catch(function(err){
                    console.log(err);
                    $scope.divGeral = false;
                    $scope.transPend.visaoGeral = false;                    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:99');  
                    };               
                });                 
            }else {
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
            };
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        };   
    };

    //========== POST PARA CADASTRAR CAMPANHA PORTAL HAVAN ==========//
    $scope.formularioDadosCampanhaPortalHavan = function(){
        console.log($scope.formularioDados )
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){              
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'formularioDadosCampanhaPortalHavan/',
                method: 'POST',
                data: {'formularioDadosCampanhaPortalHavan': $scope.formularioDados},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                console.log("OK")
                if(event.status == 200){        
                    if($scope.formularioDados.value == 'C') {
                        growl.success('<b>SUCESSO</b><br> Campanha cadastrada com sucesso!');
                    }else{
                        growl.success('<b>SUCESSO</b><br> Campanha editada com sucesso!');
                    };                    
                }else{
                    if($scope.formularioDados.value == 'C') {
                        growl.error('<b>ERROR</b><br> Campanha não cadastrada, tente novamente!');
                    }else{
                        growl.error('<b>ERROR</b><br> Campanha não editada, tente novamente!');
                    };
                }; 
                
                $scope.pesquisaCampanhaPortalHavan('','');                          
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:100');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };
    };    

    $scope.menu = function(value){
        if(value == 1){
            $scope.divVisualizar = false;
            $scope.divFormulario = true;
            $scope.botaoVolta = true;  
            $scope.formularioDados.value = 'C';         
        }else if(value == 2){
            $scope.divVisualizar = true;
            $scope.divFormulario = false;
            $scope.botaoVolta = false;
            $scope.formularioDados.value = ''
        };
    }

    //========== FUNÇÃO JQUERY MASK MONEY  ==========// 
    $('#investimentoMoney').maskMoney({ allowNegative: true, thousands:'.', decimal:',', affixesStay: true})
    $('#fechamentoMoney').maskMoney({ allowNegative: true, thousands:'.', decimal:',', affixesStay: true})

   
});


