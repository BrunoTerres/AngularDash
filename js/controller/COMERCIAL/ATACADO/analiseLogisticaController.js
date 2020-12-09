app.controller('analiseLogisticoController', function($scope, $http,growl,Upload){
    
    if (!$scope.permissoes[28] && !$scope.permissoes[42]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    //==========  VARIAVEIS E FUNÇÕES PARA TABELAS DINAMICAS ==========//   
    
    $scope.codigoTransportador = {
        codigo: ''
    };      
    $scope.divCadastroTransporte = false;

    $scope.contagemLogistico =10;  
    $scope.filterLogistico= function(data){  
        $scope.contagemLogistico =10
        
        if(data.id == 'X'){
            $scope.contagemLogistico = 10;          
        }else {
            $scope.contagemLogistico = 50;
               
        }
    };   
    
    $scope.contagemCheckout = 10;
    $scope.selecaoCheckout ={
         selectedOption: {id: '10', name: '10'},
         availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
         ]
    };  

    $scope.filterCheckout = function(data){
        $scope.contagemCheckout = data.id;   
    };
    
    $scope.contagemProduto = 10;
    $scope.selecaoProduto ={
         selectedOption: {id: '10', name: '10'},
         availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
         ]
    }; 

    $scope.filterProduto = function(data){
        $scope.contagemProduto = data.id;   
    };
    
    $scope.contagemExpedicao = 10;
    $scope.selecaoExpedicao ={
         selectedOption: {id: '10', name: '10'},
         availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
         ]
    };  
     
    $scope.filterExpedicao = function(data){
        $scope.contagemExpedicao = data.id;   
    };
      
    //==========  VARIAVEIS GLOBAIS  ==========//
    $scope.infoObsAtacadoEditar = [] 
    $scope.infoObsAtacado = []
    $scope.infoAnalise = [];   
    $scope.divTrocaTransportador = false;
    $scope.divObsVisualizar = false;
    $scope.divObsCadastrar = false; 
    $scope.divObsEditar = false; 
    $scope.divApresenta = false;   
    $scope.divFrete = false;     
     
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)   
    $scope.dateTransporte = {
        dataExpedicao: primeiroDia,
        dataImpressao: primeiroDia
    };

    $scope.cadastroTransportador = {
        justificativa: '',
        transportador: '',
        dataInicio: '',
        dataInicial: '',
        dataFinal: '',       
        rastreio: '',        
        dataFim: '',        
        usuario: '',
        cliente: '',
        empresa: '',
        numero: '',
        serie: ''  
    };

    $scope.infoFrete = {
        usuario: $scope.login.usuario,    
        cadastroFrete: 0,
        dataInicio: '',      
        empresa: '',
        dataFim: '',
        numero: '',
        serie:''     
    };

    $scope.editarFrete = {
        usuario: $scope.login.usuario,
        cadastroFrete: 0,
        dataInicio: '',  
        empresa: '',
        dataFim: '',
        numero: '',
        serie:''     
    };

    $scope.infoEntregue = {
        usuario: $scope.login.usuario,
        dataEntregue: primeiroDia,  
        justificativa: '', 
        dataInicial: '',   
        dataFim: '' ,      
        cliente:'',
        empresa: '',
        numero: '',
        serie: ''         
    };    
      
    $scope.infoCadastroObs = {
        usuario: $scope.login.usuario,
        nome: $scope.login.nome,
        observacao: '',
        empresa: '',
        cliente: '',
        numero: '',
        serie: '',           
    };

    //==========  FUNÇÃO PARA INVERTE OS DADOS DA TABELA ==========// 
    $scope.propertyName = 'emissaoPD';
    $scope.reverse = true;    
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    //==========  FILTRO DE CORES E EMPRESA ==========// 
    $scope.dataEmpresa = {
        selectedOption: {id:'X', name:'EMPRESA'},
        availableOptions: [
           {id:'X', name:'EMPRESA'},
           {id:'005', name:'005'},
           {id:'009', name:'009'},
       ]
    };      
   
    $scope.data = {
        selectedOption: {id:'X', name:'STATUS'},
        availableOptions: [
           {id:'X', name:'STATUS'},
           {id:'1', name:'VERDE - COM DT. EXPEDIÇÃO E COD. RASTREIO '},
           {id:'2', name:'VERMELHO  - SEM DT. EXPEDIÇÃO E COD. RASTREIO '},
           {id:'3', name:'AMARELO - SEM DT. EXPEDIÇÃO E COM COD. RASTREIO '},
           {id:'S', name:'ROXO - BAIXA MANUAL, JÁ EXPEDIDO '},  
           {id:'A', name:'AZUL - PRODUTO ENTREGUE '},
           {id:'P', name:'LARANJA - TRANSPORTADOR NOVO '},          
        ]
    };

    //========== FUNÇÃO POST PARA ANALISE LOGÍSTICO ==========// 
    $scope.analiseLogisticaAtacado = function(codigoCliente){
        $scope.divApresenta = false;
        $scope.botaoAgendamento = false;
        $scope.filtro.codigoCliente = codigoCliente;
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
           if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'analiseLogisticaAtacado/',
                method: 'POST',
                data: {'analiseLogisticaAtacado': $scope.filtro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token
                }     
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;  
                if(event.data.checkoutxnotas.error == true){
                    growl.warning('<b>ATENÇÃO</b><br> Não existe dados no período selecionado');  
                }else{                                 
                    $scope.infoAnalise = event.data;   
                    $scope.url = $scope.infoAnalise.analiseLogistico.urlPlanilha;    
                    if($scope.login.idperfil == 1 || $scope.login.idperfil == 7 || $scope.login.idperfil == 18 || $scope.login.idperfil == 23 || $scope.login.idperfil == 44  && $scope.login.usuario == 'leonardo.g' || $scope.login.idperfil == 47){
                        $scope.botaoAgendamento = true;
                    };               
                    $scope.divApresenta = true;
                };                
            }).catch(function(err){  
                console.log(err);        
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 61');    
                };                                    
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        };
    };  
    /* UTILIZAR ID ERRO 63 */
    
    //========== FUNÇÃO POST PARA PESQUISAR SEM DATA EXPEDIÇÃO, ETIQUE E CHECKOUT ==========// 
    $scope.pesquisaPendenciasNotasAtacado = function(data, empresa, total, value, codigoCliente){
        $scope.infoPesquisa = {
            codigoVendedor: $scope.login.codvendedor,
            superUsuario: $scope.login.superuser,
            idperfil:$scope.login.idperfil,
            empresa: empresa,
            value: value,
            total: total, 
            data: data, 
            codigoCliente: codigoCliente     
        };  

        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaPendenciasNotasAtacado/',
                method: 'POST',
                data: {'pesquisaPendenciasNotasAtacado': $scope.infoPesquisa},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;  
                      
                $scope.pesquisaNotas = event.data.pesquisaNotas  ;
                $('#modalPesquisaNotas').trigger('click'); 
            }).catch(function(err){  
                console.log(err);             
                $scope.transPend.visaoGeral = false;                 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 62');    
                };                    
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
        
    };

    //========== FUNÇÃO AGENDAMENTO - CAPTAÇÃO DE DADOS E CHAMADA DE MODAL  ==========// 
    $scope.AgendamentoDeEntrega = function(empresa,serie,nota, cliente, emissao, total, quantidade){
        var data = new Date();
        var primeiroDia = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1);
        $scope.infoAgendamento = {           
            dataInicial: $scope.infoAnalise.datas.dataInicio,
            dataFim: $scope.infoAnalise.datas.dataFim,        
            usuario: $scope.login.usuario,             
            agendamento: primeiroDia,
            quantidade: quantidade,           
            justificativa: '',
            empresa: empresa,
            cliente: cliente,
            emissao: emissao,            
            total: total,
            serie: serie,
            nota: nota,
            local: $scope.path
           
        };       
        $('#modalAgendamento').trigger('click'); 
    };
    
    //========== FUNÇÃO AGENDAMENTO - INSERT TABELA NOTAS  ==========// 
    $scope.agendamentoLogisticoAtacado = function(){
        $scope.AgendamentoDados = [];
        if(new Date() >  $scope.infoAgendamento.agendamento){
            growl.warning('<b>ATENÇÃO</b><br> Data para agendamento deve ser maior que a data de hoje!');
        }
        else{
            if($scope.infoAgendamento.justificativa.length < 15){
                growl.warning('<b>ATENÇÃO</b><br> A Justificativa deve conter mais de 15 caracteres!');
            }
            else{    
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'agendamentoLogisticoAtacado/',
                        method: 'POST',
                        data: {'agendamentoLogisticoAtacado': $scope.infoAgendamento},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }      
                    }).then(function(event){ 
                        $scope.transPend.visaoGeral = false; 
                        $scope.AgendamentoDados = event.data;                    
                        if(event.status == 200){
                            $scope.infoAnalise.analiseLogistico = $scope.AgendamentoDados.refreshAnalise                           
                            
                            $('#myModalAgendamento').modal('hide');
                            setTimeout(function() { growl.success('<b>SUCESSO</b><br> Agendamento salvo!')  }, 6000);  
                        }else{
                            growl.warning('<b>ATENÇÃO</b><br> Tente agendar novamente!')  
                        };                       
                    }).catch(function(err){   
                        console.log(err);
                        $scope.transPend.visaoGeral = false;  
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 64');   
                        };      
                    })  
                }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };
            };
        };
    };
   
    //========== FUNÇÃO PARA BAIXAR AS NOTAS  ==========// 
    $scope.baixarNota = function(empresa,serie,nota, cliente, emissao, total, quantidade){
        $scope.infoBaixa = {
            dataInicial: $scope.infoAnalise.datas.dataInicio,
            dataFim:$scope.infoAnalise.datas.dataFim,        
            usuario: $scope.login.usuario,           
            quantidade: quantidade,           
            justificativa: '',
            empresa: empresa,
            cliente: cliente,
            emissao: emissao,            
            total: total,
            serie: serie,
            nota: nota,
            local: $scope.path
        };
        $('#modalBaixa').trigger('click');         
    };
    //========== FUNÇÃO POST PARA BAIXAR AS NOTAS  ==========// 
    $scope.baixarNotaAtacado= function(){
        $scope.baixaAtacado = [];
        if($scope.infoBaixa.justificativa.length < 15){
            growl.warning('<b>ATENÇÃO</b><br> A Justificativa deve conter mais de 15 caracteres!');
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'baixarNotaAtacado/',
                    method: 'POST',
                    data: {'baixarNotaAtacado': $scope.infoBaixa},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }    
                }).then(function(event){  
                    $scope.transPend.visaoGeral = false;    
                    $scope.baixaAtacado = event.data;             
                    if(event.status == 200){                       
                        $scope.infoAnalise.analiseLogistico = $scope.baixaAtacado.refreshAnalise; 
                        $('#myModalBaixa').modal('hide'); 
                        setTimeout(function() { growl.success('<b>SUCESSO</b><br> Baixa Concluída!')  }, 100);                         
                    }else{
                        growl.warning('<b>ATENÇÃO</b><br> Tente baixar novamente!')  
                    };                   
                }).catch(function(err){   
                    console.log(err);
                    $scope.transPend.visaoGeral = false;     
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 65');  
                    };     
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };  
        };
    };

    //========== FUNÇÃO PARA PESQUISAR TRANSPORTADOR  ==========// 
    $scope.pesquisaTransportadorAtacado = function(value,usuario,empresa,numero,serie,cliente){
        if($scope.codigoTransportador.codigo == ''){
            growl.warning('<b>ATENÇÃO</b><br> Digite código do transportador!') 
        }else{
            $scope.infoTransportador = [];         
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'pesquisaTransportadorAtacado/',
                    method: 'POST',
                    data: {'pesquisaTransportadorAtacado': $scope.codigoTransportador},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }     
                }).then(function(event){  
                    $scope.transPend.visaoGeral = false;  
                    $scope.infoTransportador = event.data;              
                    if($scope.infoTransportador.transportador.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Código informado não existe, tente novamente!')                       
                    }else{
                        if(value == 'S'){
                            $scope.divTrocaTransportador = false;                            
                            $scope.transporteInfo.transportadorNovo.nomeTransportadora = $scope.infoTransportador.transportador.data.nome;                             
                        }else{
                            $scope.divCadastroTransporte = true;  
                            $scope.cadastroTransportador.usuario = usuario;           
                            $scope.cadastroTransportador.empresa = empresa;
                            $scope.cadastroTransportador.numero = numero;
                            $scope.cadastroTransportador.serie = serie;   
                            $scope.cadastroTransportador.cliente = cliente; 
                            $('#modalTransCadastro').trigger('click');     
                        };                                                         
                    };                      
                }).catch(function(err){   
                    console.log(err);
                    $scope.transPend.visaoGeral = false;    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 66'); 
                    };  
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };  
        };     
    };

    //========== FUNÇÃO PARA CADASTRAR O TRANSPORTADOR  ==========// 
    $scope.cadastroTransportadorAtacado = function(){
        if($scope.isValidDate($scope.dateTransporte.dataExpedicao) && $scope.isValidDate( $scope.dateTransporte.dataImpressao)){   
            $scope.cadastroTransportador.transportador = $scope.infoTransportador.transportador.data.nome;
            $scope.cadastroTransportador.dataInicial = $scope.dateTransporte.dataExpedicao;
            $scope.cadastroTransportador.dataInicio = $scope.infoAnalise.datas.dataInicio;
            $scope.cadastroTransportador.dataFim = $scope.dateTransporte.dataImpressao;
            $scope.cadastroTransportador.dataFinal =  $scope.infoAnalise.datas.dataFim;
                
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'cadastroTransportadorAtacado/',
                    method: 'POST',
                    data: {'cadastroTransportadorAtacado': $scope.cadastroTransportador},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
                }).then(function(event){ 
                    $scope.transPend.visaoGeral = false; 
                    if(event.status == 200){    
                        $scope.infoAnalise.analiseLogistico = event.data.refreshAnalise;  
                        //$('#'+ cid).collapse('hide')
                        //$('#'+ tid).collapse('show')
                        $scope.codigoTransportador.codigo = '';
                        $scope.divCadastroTransporte = false;
                        $scope.cadastroTransportador = {
                            justificativa: '',
                            transportador: '',
                            dataInicio: '',
                            dataInicial: '',
                            dataFinal: '',       
                            rastreio: '',        
                            dataFim: '',        
                            usuario: '',
                            cliente: '',
                            empresa: '',
                            numero: '',
                            serie: ''  
                        };
                        $('#myModalTransCadastro').modal('hide'); 
                        setTimeout(function() { growl.success('<b>SUCESSO</b><br> Transportador cadastrado com sucesso!'); }, 100);      
                    }else{
                        growl.error('<b>ERROR</b><br> Campanha não cadastrada, tente novamente!');
                    };                     
                }).catch(function(err){   
                    console.log(err);
                    $scope.transPend.visaoGeral = false;  
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 67');  
                    };   
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        };       
    };

    //========== FUNÇÃO PARA PESQUISAR NO CADASTRO TRANSPORTADOR NOVO ==========// 
    $scope.pesquisarCadTransportadorAtacado = function(numero,empresa,serie,cliente){
        $scope.infoTransporte = {
                cliente: cliente,
                empresa: empresa,
                numero: numero,           
                serie: serie,            
        };
        $scope.transporteInfo = [];         
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisarCadTransportadorAtacado/',
                method: 'POST',
                data: {'pesquisarCadTransportadorAtacado': $scope.infoTransporte},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){  
                $scope.transPend.visaoGeral = false; 
                $scope.transporteInfo = event.data;
                //========== CRIAR DATA PARA CALENDARIO HTML ==========//                      
                var dateExpedicao =  $scope.transporteInfo.transportadorNovo.dataInicial.split('-');
                var dateEmissao =   $scope.transporteInfo.transportadorNovo.dataFim.split('-');      
                dateExpedicao = new Date(parseInt(dateExpedicao[2]), parseInt(dateExpedicao[1]-1), parseInt(dateExpedicao[0]));          
                dateEmissao = new Date(parseInt(dateEmissao[2]), parseInt(dateEmissao[1]-1), parseInt(dateEmissao[0]));
                if($scope.isValidDate(dateExpedicao) && $scope.isValidDate(dateEmissao)){   
                    $scope.transporteInfo.transportadorNovo.dataInicio = $scope.infoAnalise.datas.dataInicio;
                    $scope.transporteInfo.transportadorNovo.dataFinal =  $scope.infoAnalise.datas.dataFim; 
                    $scope.transporteInfo.transportadorNovo.usuario = $scope.login.usuario;
                    $scope.transporteInfo.transportadorNovo.dataInicial = dateExpedicao;
                    $scope.transporteInfo.transportadorNovo.dataFim = dateEmissao;                  
                    $('#modalNovoTransp').trigger('click');
                }else {
                    growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
                };                                            
            }).catch(function(err){   
                console.log(err);                
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 68');  
                };      
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };

    //========== FUNÇÃO PARA EDITAR TRANSPORTADOR NOVO ==========// 
    $scope.editarTransportadorNovoAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'editarTransportadorNovoAtacado/',
                method: 'POST',
                data: {'editarTransportadorNovoAtacado': $scope.transporteInfo.transportadorNovo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }    
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false; 
                if(event.status == 200){   
                    $scope.infoAnalise.analiseLogistico = event.data.refreshAnalise;  
                    $('#myModalNovoTransp').modal('hide');                      
                    $scope.codigoTransportador.codigo = '';      
                    setTimeout(function() { growl.success('<b>SUCESSO</b><br> Transportador alterado com sucesso!'); }, 100);               
                }else{
                    growl.error('<b>ERROR</b><br> Transportador não alterado, tente novamente!');
                };                                                        
            }).catch(function(err){   
                console.log(err);
                $scope.transPend.visaoGeral = false;    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 67');   
                };   
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };          
    };

    //========== FUNÇÃO PARA CHAMAR MODAL OU NÃO ==========// 
    $scope.modalCadastroFreteAtacado = function(empresa,numero,serie,frete){
        if(frete == 'N' &&  $scope.botaoAgendamento == true){    
            $scope.divFrete = false;               
            growl.warning('<b>ATENÇÃO</b><br>Valor do frete não cadastrado!');      
            $scope.divFrete = false;    
        }else if(frete == 'S'){
            $scope.divFrete = true;
        }else{
            $scope.divFrete = false;  
            growl.warning('<b>ATENÇÃO</b><br>Frete não cadastrado, entre em contato com a Logística!');
        };    
    };  

    //========== FUNÇÃO PARA CHAMAR MODAL EDITAR FRETE ==========// 
    $scope.modalEditarFreteAtacado = function(empresa,numero,serie){
        $scope.editarFrete.dataInicial = $scope.infoAnalise.datas.dataInicio;
        $scope.editarFrete.dataFim = $scope.infoAnalise.datas.dataFim;  
        $scope.editarFrete.local = $scope.filtro.local; 
        $scope.editarFrete.empresa = empresa;
        $scope.editarFrete.numero = numero;
        $scope.editarFrete.serie = serie;
        $('#modalEditarFrete').trigger('click'); 
    };

    //========== FUNÇÃO PARA EDITAR O FRETE ==========// 
    $scope.editarFreteAtacado = function(){
        if($scope.editarFrete.cadastroFrete == 0){
            growl.warning('<b>ATENÇÃO</b><br> Informe o valor do frete!');
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'editarFreteAtacado/',
                    method: 'POST',
                    data: {'editarFreteAtacado':  $scope.editarFrete},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }     
                }).then(function(event){ 
                    $scope.transPend.visaoGeral = false;  
                    if(event.status == 200){   
                        $scope.infoAnalise.analiseLogistico = event.data.refreshAnalise;                      
                        $scope.editarFrete = {
                            usuario: $scope.login.usuario,
                            cadastroFrete: 0,
                            empresa: '',
                            numero: '',
                            serie:''     
                        };                        
                        $('#myModalEditarFrete').modal('hide');   
                        setTimeout(function() {   growl.success('<b>SUCESSO</b><br> Frete alterado com sucesso!');  }, 100);                                 
                    }else{
                        growl.error('<b>ERROR</b><br> Frete não alterado, tente novamente!');
                    };                                                       
                }).catch(function(err){   
                    console.log(err);
                    $scope.transPend.visaoGeral = false; 
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 69');     
                    };        
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
        };   
    };

    //========== FUNÇÃO PARA CHAMAR MODAL E MUDAR STATUS PARA ENTREGUE ==========// 
    $scope.modalEntregueClienteAtacado = function(){
        $('#modalEntrega').trigger('click'); 
    };

    //========== FUNÇÃO PARA MUDAR STATUS PARA ENTREGUE ==========//
    $scope.entregueClienteAtacado = function(){
        if ($scope.formPlanilha.filePlanilha.$valid && $scope.filePlanilha) {
            $scope.filePlan = {
                filePlanilha: $scope.filePlanilha,
                usuario: $scope.login.usuario,
                local: $scope.path,
                dataInicial: $scope.filtro.dataInicial,
                dataFim: $scope.filtro.dataFim
               
            };
            Upload.upload({
                url: $scope.baseApi +'entregueClienteAtacado/',
                data: $scope.filePlan,
                headers: {
                    'Authorization': $scope.login.token 
                }
            }).then(function(event) {          
                $scope.transPend.visaoGeral = false;
                var entregue = event.data.refreshAnalise
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Upload Enviado!');
                    $scope.divCadastro = false;   
                    $scope.divCadastroProduto = false;  
                    $scope.progressoProdutos = 0; 
                    $scope.url = entregue.urlPlanilha;  
                    $scope.infoAnalise.analiseLogistico.data = entregue.data;
                    $scope.infoAnalise.analiseLogistico.qtdeTotal = entregue.qtdeTotal;
                    $scope.infoAnalise.analiseLogistico.valorTotal = entregue.valorTotal;
                    $('#myModalEntrega').modal('hide');                                                         
                }else{              
                    growl.warning('<b>ATENÇÃO!</b><br>Upload não Enviado!');
                };        
            },function(err) {
                console.log(err)
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 70');   
                };                    
            },function (evt) {            
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progressoProdutos = progressPercentage;          
            });         
        };         
        
    };

    //========== FUNÇÃO PARA PESQUISAR OBSERVAÇÕES ==========//
    $scope.pesquisaObsNotaAtacado = function(empresa,numero,serie, cliente, id,value,modal){
        $scope.infoObs = {        
            cliente: cliente, 
            empresa: empresa,    
            numero: numero,
            serie: serie,
            value: value,  
            id: id    
        }; 
        $scope.divObsEditar = false;  
        $scope.divObsVisualizar = false; 
        $scope.divObsCadastrar = false;  
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaObsNotaAtacado/',
                method: 'POST',
                data: {'pesquisaObsNotaAtacado':  $scope.infoObs},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){              
                $scope.transPend.visaoGeral = false;   
                if(event.data.infoObsPesquisa.error == true){                    
                    growl.warning('<b>ATENÇÃO</b><br> Não existe observação cadastrada!');
                    if($scope.botaoAgendamento == true){    
                        $scope.infoCadastroObs = {
                            usuario: $scope.login.usuario,
                            nome: $scope.login.nome,
                            observacao: '',
                            empresa: '',
                            cliente: '',
                            numero: '',
                            serie: '',           
                        };                     
                        $scope.divVolta = false;
                        $scope.divObsEditar = false;  
                        $scope.divObsVisualizar = false; 
                        $scope.divObsCadastrar = true;  
                        if(modal == 'S'){
                            $('#modalObservacao').trigger('click'); 
                        }
                        setTimeout(function() { $scope.modalCadastroObsNotaAtacado(empresa,numero,serie,cliente);  }, 100);                                 
                    }
                }else if(value == 'S'){    
                    $scope.divObsCadastrar = false;            
                    $scope.divObsVisualizar = false;  
                    $scope.divObsEditar = true; 
                    $scope.divVolta = true;  
                    $scope.infoObsAtacadoEditar = event.data 
                }else{   
                    if(modal == 'S'){
                        $('#modalObservacao').trigger('click'); 
                    }             
                    $scope.infoObsAtacado = event.data 
                    $scope.divObsVisualizar = true;                     
                    $scope.divObsCadastrar = false;    
                    $scope.divObsEditar = false; 
                    $scope.divVolta = true;           
                };                                        
            }).catch(function(err){  
                console.log(err);                 
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 71');   
                };      
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };

    //========== FUNÇÃO PARA CHAMAR MODAL CADASTRO OBSERVAÇÃO DA NOTA ==========// 
    $scope.modalCadastroObsNotaAtacado = function(empresa,numero,serie,cliente){
        $scope.infoCadastroObs.dataInicial = $scope.filtro.dataInicial;
        $scope.infoCadastroObs.dataFim = $scope.filtro.dataFim;
        $scope.infoCadastroObs.local = $scope.filtro.local;
        $scope.infoCadastroObs.observacao = '';     
        $scope.divObsVisualizar = false; 
        $scope.divObsCadastrar = true;  
        $scope.infoCadastroObs.cliente = cliente;
        $scope.infoCadastroObs.empresa = empresa;
        $scope.infoCadastroObs.numero = numero;
        $scope.infoCadastroObs.serie = serie;   
    
    };

    //========== FUNÇÃO PARA CADASTRO OBSERVAÇÃO DA NOTA ==========// 
    $scope.cadastroObsNotaAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'cadastroObsNotaAtacado/',
                method: 'POST',
                data: {'cadastroObsNotaAtacado':  $scope.infoCadastroObs},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }   
            }).then(function(event){  
                var obs = event.data.refreshAnalise;                  
                if(event.status == 200){                    
                    $scope.transPend.visaoGeral = false;  
                    $scope.divObsVisualizar = false;
                    $scope.url = obs.urlPlanilha;
                    $scope.infoAnalise.analiseLogistico.data = obs.data;
                    $scope.infoAnalise.analiseLogistico.qtdeTotal = obs.qtdeTotal;
                    $scope.infoAnalise.analiseLogistico.valorTotal = obs.valorTotal; 
                    $scope.pesquisaObsNotaAtacado($scope.infoCadastroObs.empresa,$scope.infoCadastroObs.numero,$scope.infoCadastroObs.serie, $scope.infoCadastroObs.cliente,'','','N');   
                    setTimeout(function() { growl.success('<b>SUCESSO</b><br> Observação cadastrada com sucesso, Aguarde!'); }, 100);     
                    $('#myModalObservacao').modal('hide');                     
                }else{
                    growl.warning('<b>ATENÇÃO</b><br> Observação não cadastrada!');
                }                         
                $scope.transPend.visaoGeral = false;                       
            }).catch(function(err){   
                console.log(err);                
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 72');   
                };    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };

    //========== FUNÇÃO PARA EDITAR OBSERVAÇÃO DA NOTA ==========// 
    $scope.editarObsNotaAtacado = function(){
        $scope.infoEditarObs = $scope.infoObsAtacadoEditar.infoObsPesquisa;   
        $scope.infoEditarObs.usuarioAlteracao = $scope.login.usuario 
        $scope.infoEditarObs.dataInicial = $scope.filtro.dataInicial;
        $scope.infoEditarObs.dataFim = $scope.filtro.dataFim;  
        $scope.infoEditarObs.local = $scope.filtro.local;  
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'editarObsNotaAtacado/',
                method: 'POST',
                data: {'editarObsNotaAtacado':  $scope.infoEditarObs},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;   
                var obs = event.data.refreshAnalise;           
                if(event.status == 200){     
                    $scope.url = obs.urlPlanilha; 
                    $scope.infoAnalise.analiseLogistico.data = obs.data;
                    $scope.infoAnalise.analiseLogistico.qtdeTotal = obs.qtdeTotal;
                    $scope.infoAnalise.analiseLogistico.valorTotal = obs.valorTotal;              
                    $scope.transPend.visaoGeral = false; 
                    $scope.pesquisaObsNotaAtacado($scope.infoEditarObs.empresa,$scope.infoEditarObs.numero,$scope.infoEditarObs.serie, $scope.infoObs.cliente ,'','','N');   
                    setTimeout(function() { growl.success('<b>SUCESSO</b><br> Observação alterada com sucesso, Aguarde!'); }, 100);
                    $('#myModalObservacao').modal('hide');                          
                }else{
                    growl.warning('<b>ATENÇÃO</b><br> Observação não alterada!');
                };                                          
            }).catch(function(err){   
                console.log(err);                
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 73');   
                };    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
     
    };

    $scope.menu = function(value){
        if(value == 1){
            $scope.divObsCadastrar = false;
            $scope.divObsVisualizar = true;
        }else if(value == 2){
            $scope.divObsVisualizar = true;  
            $scope.divObsEditar = false;  
        }
     
    };

    /* UTILIZAR ID ERRO 63 */

});

