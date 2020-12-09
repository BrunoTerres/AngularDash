app.controller('devolucaoAvariaController', function($scope, $http,growl){

    if (!$scope.permissoes[39]){
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
        id: ''
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
            $scope.referenteHavan = informacoes.referente;
            $scope.statusDevolucao = informacoes.statusDevolucao;                                           
        }).catch(function(err){
            console.log(err);
            $scope.transPend.visaoGeral = false;                    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:101');  
            };               
        });            
    };   

    $scope.informacoesHavan();

    //========== POST PARA LIBERAR E BLOQUEAR PERMISSAO ==========//
    $scope.pesquisaDevolucaoAvariaPH  = function (id,value){
        $scope.formularioDados = {
            usuario: $scope.login.usuario,
            value: '',
            id: ''
        };
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){    
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){              
                $scope.transPend.visaoGeral = true;
                $scope.filtro.value = value;
                $scope.filtro.id = id;
                $http
                ({
                    url: $scope.baseApi +'pesquisaDevolucaoAvariaPH/',
                    method: 'POST',
                    data: {'pesquisaDevolucaoAvariaPH': $scope.filtro},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }
                }).then(function(event){
                    $scope.transPend.visaoGeral = false; 
                    $scope.divGeral = true;
                    var devolucao = event.data; 
                   
                    if(value == 'E'){               
                        $scope.formularioDados = devolucao.devolucaoAvaria;
                        $scope.formularioDados.data = $scope.convercaoDataParaJS($scope.formularioDados.data);                        
                        $scope.formularioDados.usuario = $scope.login.usuario;                     
                        $scope.formularioDados.value = value;                                               
                        $scope.divVisualizar = false;
                        $scope.divFormulario = true;
                        $scope.buttonEditar = true;
                        $scope.botaoVolta = true;
                    }else{
                        if(devolucao.error == true){
                            growl.warning('<b>ATENÇÃO!</b><br>Não existe devoluções e avarias cadastrada!'); 
                            $scope.divVisualizar = false;
                            $scope.divFormulario = true;     
                            $scope.formularioDados.value = 'C'                              
                        }else{                      
                            $scope.devolucaoeAvarias = devolucao.devolucaoAvaria;
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
                        growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:102');  
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
    $scope.formularioDadosDevolucaoAvariaPH = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){              
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'formularioDadosDevolucaoAvariaPH/',
                method: 'POST',
                data: {'formularioDadosDevolucaoAvariaPH': $scope.formularioDados},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;            
                if(event.status == 200){        
                    if($scope.formularioDados.value == 'C') {
                        growl.success('<b>SUCESSO</b><br> Devoluções e Avaria cadastrada com sucesso!');
                    }else{
                        growl.success('<b>SUCESSO</b><br> Devoluções e Avaria  editada com sucesso!');
                    };                    
                }else{
                    if($scope.formularioDados.value == 'E') {
                        growl.error('<b>ERROR</b><br> Campanha não cadastrada, tente novamente!');
                    }else{
                        growl.error('<b>ERROR</b><br> Devoluções e Avaria  não editada, tente novamente!');
                    };
                };                 
                $scope.pesquisaDevolucaoAvariaPH('','');                          
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:103');  
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
    $('#valorNF').maskMoney({ allowNegative: true, thousands:'.', decimal:',', affixesStay: true})
 
});


